const express = require('express');
const app = express();
const snek = require('snekfetch');

const { join } = require('path');
require('dotenv').config({ path: join(__dirname, '../.env') });

// var Sequelize = require('sequelize');

/* var webUserBase = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: '../databases/webUserBase.sqlite'
});
var userTable = webUserBase.define('userTable', {
  access_token: {
    type: Sequelize.STRING,
    allowNull: false
  },
  refresh_token: {
    type: Sequelize.STRING,
    allowNull: false
  },
  expires: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  userID: Sequelize.STRING
});
userTable.sync(); */

app.use('/assets', express.static(__dirname + '/assets'));
app.use('/favicons', express.static(__dirname + '/favicons'));

app.listen(8080, () => console.log('Website listening on port 8080!')); // Actually supposed to be port 80 but for testing purposes it's on 8080 (since my fucking ISP blocked 80)

express.addPage = (page) => app.get(`/${page}`, (req, res) => res.sendFile(join(__dirname, `./${page}.html`)));

app.get('/', async (req, res) => res.sendFile(join(__dirname, './index.html')));

app.get('/authorizing', async (req, res) => {
  if (req.query.code === undefined) return;

  const data = {
    'client_id': '377205339323367425',
    'client_secret': process.env.CLIENT_SECRET,
    'grant_type': 'authorization_code',
    'code': req.query.code,
    'redirect_uri': 'http://localhost:8080/authorizing',
    'scope': 'identify guilds'
  };

  try {
    await snek.post('https://discordapp.com/api/v6/oauth2/token', { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, data: data })
      .then(data => {
        console.log(data.text);
        //userTable.create({access_token: data.text.access_token, refresh_token: data.text.refresh_token, expires: data.text.expires_in});
        //userTable.sync();
        res.sendFile(join(__dirname, './error-pages/auth-success.html'));
      })
      .catch(e => {
        console.log(e);
        res.sendFile(join(__dirname, './error-pages/auth-error.html'));
      });
  } catch (e) {
    console.log(e);
    res.sendFile(join(__dirname, './error-pages/auth-error.html'));
  }
});

app.get('/login', (req, res) => res.redirect('https://discordapp.com/api/oauth2/authorize?client_id=377205339323367425&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauthorizing&response_type=code&scope=identify%20guilds'));

app.get('/invite', (req, res) => res.redirect('https://discordapp.com/api/oauth2/authorize?client_id=377205339323367425&permissions=2080894199&scope=bot'));

express.addPage('commands');
express.addPage('authorizing');
express.addPage('stats');
express.addPage('terms');
express.addPage('servers');

app.use(function(req, res) {
  res.status(404).sendFile(join(__dirname, './error-pages/404.html'));
});

app.use(function(err, req, res) {
  console.error(err.stack);
  res.status(500).sendFile(join(__dirname, './error-pages/500.html'));
});

// module.exports = { userTable };