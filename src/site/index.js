/* eslint-disable */
require('dotenv').config();

const express = require('express');
const app = express();
const session = require('express-session');
const { join } = require('path');
const { readdirSync } = require('fs');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const refresh = require('passport-oauth2-refresh');
const cors = require('cors');

const User = require('./models/user').userModel;

app.use('/assets', express.static('assets')); // Creates https://domain.tld/assets/...
app.use(cors());

// PASSPORT REQUIREMENTS
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  console.log('Serialize: ', user);
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  console.log('Deserialize: ', obj);
  done(null, obj);
});

app.use((req, res, next) => {
  if(req.body) console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.originalUrl}`, Object.keys(req.body).length !== 0 ? req.body : '');
  else console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.originalUrl}`);
  next();
});

var discordStrat = new DiscordStrategy({
  clientID: '377205339323367425',
  clientSecret: process.env.DISCORD_SECRET,
  callbackURL: 'login-success',
  scope: ['identify', 'email', 'guilds']
},
function(accessToken, refreshToken, profile, cb) {
  profile.accessToken = accessToken;
  profile.refreshToken = refreshToken; // store this for later refreshes

  User.findOrCreate({ where: { userID: profile.id }, defaults: { 
    username: profile.username, 
    discrim: profile.discriminator, 
    email: profile.email, 
    avatar: profile.avatar, 
    refreshToken 
  } })
    .then(user => {
      user = user[0];
      user.dataValues.accessToken = accessToken;
      return cb(null, user.dataValues);
    })
    .catch(err => cb(err));
});
passport.use(discordStrat);
refresh.use(discordStrat);

app.get('/', (req, res) => {
  if(req.isUnauthenticated()) return res.status(401).send({ error: true, message: 'Error: Unauthenticated. Go to /login' });
  else res.redirect('/guilds');
});

app.get('/login', passport.authenticate('discord'));
app.get('/login-success', passport.authenticate('discord', {
  failureRedirect: '/login-failed',
  session: true
}), (req, res) => {
  console.log(`USER LOGIN VIA OAUTH2: ${req.user.userID} ${req.user.username}#${req.user.discrim} | Access token: ${req.user.accessToken} | Refresh token: ${req.user.refreshToken}`);
  req.session.sessionID = req.sessionID;
  res.redirect('/guilds') // Successful auth
});
app.get('/login-failed', (req, res, next) => res.send('Login failed.'));

app.get('/logout', (req, res) => { req.logout(); res.redirect('/logout-success') });
app.get('/logout-success', (req, res) => { res.send('Logout successful'); });

app.get('/guilds', (req, res, next) => {
  res.redirect('/api/guilds');
  //res.sendFile(join(__dirname, './index.html'))
});

const routes = readdirSync('./routes/');
routes.forEach(route => {
  const routeName = route.split('.js')[0];
  const router = require(`./routes/${route}`);
  app.use(`/${routeName}`, router);
  console.log(`Loaded route ${route}`);
});

// Listen after everything else has been loaded first
const PORT = process.env.PORT || 1337;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));