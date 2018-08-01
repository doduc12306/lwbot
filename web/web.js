const express = require('express');
var app = express();
const path = require('path');
const config = require('../config.js');
var snek = require('snekfetch');

app.use(express.static('assets'));

app.listen(8080, () => console.log('Website listening on port 8080!'));

express.addPage = (page) => app.get(`/${page}`, (req, res) => res.sendFile(path.join(__dirname, `./${page}.html`)));

app.get(`/`, async (req, res) => res.sendFile(path.join(__dirname, `./index.html`)));

app.get('/authorizing', async (req, res) => {
  if (req.query.code === undefined) return;

  var data = {
    'client_id': '377205339323367425',
    'client_secret': config.client_secret,
    'grant_type': 'authorization_code',
    'code': req.query.code,
    'redirect_uri': 'http://localhost:8080/authorizing/'
  }

  try {
    await snek.post(`https://discordapp.com/api/v6/oauth2/token`, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: data});
    res.sendFile(path.join(__dirname, './error-pages/auth-success.html'));
  } catch (e) {
    res.sendFile(path.join(__dirname, './error-pages/auth-error.html'));
  }
});

app.get('/login', (req, res) => {
  res.redirect('https://discordapp.com/api/oauth2/authorize?client_id=377205339323367425&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauthorizing%2F&response_type=code&scope=identify%20guilds');
});

express.addPage('commands');
express.addPage('authorizing');
express.addPage('stats');
express.addPage('terms');

app.use(function (req, res, next) {
  res.status(404).sendFile(path.join(__dirname, './error-pages/404.html'));
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, './error-pages/500.html'));
});