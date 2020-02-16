/* eslint-disable */
const phin = require('phin')
const express = require('express');
const router = express.Router();

const baseDiscordURL = 'https://discordapp.com/api/v6';

router.get('/guilds', async (req, res, next) => {
  //if (req.isUnauthenticated()) return res.status(401).send({ error: true, message: 'Error: Unauthenticated. Go to /login' });

  const response = await phin({
    url: `${baseDiscordURL}/users/@me/guilds`,
    headers: { Authorization: `Bearer ${req.user.accessToken}` }
  });
  const guilds = JSON.parse(response.body.toString());
  const guildsIHaveAccessTo = [];

  guilds.forEach(guild => {
    // Using some bitwise operations (just &), we see what guilds I have the "Manage Guild" perm in
    if((guild.permissions & 0x20) === 0x20) guildsIHaveAccessTo.push(guild);
  });

  res.send(guildsIHaveAccessTo);
});

router.get('/session', (req, res, next) => {
  res.send(req.sessionID);
});

module.exports = router;