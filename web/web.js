const express = require('express');
var app = express();
const path = require('path');

app.use(express.static('assets'));

express.addPage = (page) => {
  app.get(`/${page}`, (req, res) => res.sendFile(path.join(__dirname, `./${page}.html`)));
}

app.get(`/`, (req, res) => res.sendFile(path.join(__dirname, `./index.html`)));

express.addPage('commands');
express.addPage('login');

app.listen(8080, () => console.log('Website listening on port 8080!'))

app.use(function (req, res, next) {
  res.status(404).sendFile(path.join(__dirname, './404.html'));
});