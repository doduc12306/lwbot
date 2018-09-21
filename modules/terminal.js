const Discord = require('discord.js');
const chalk = require('chalk');
const moment = require('moment');
require('moment-duration-format');
const config = require('../config.js');
const readline = require('readline');
const timestamp = `[${moment().format('YYYY-MM-DD HH:mm:ss')}]:`;

client.on('ready', () => console.log('Terminal client ready!'));
client.on('message', message => {
    console.log(``)
});

client.login(config.token);

//TODO: Create test readline functionality here. Once you get the hang of it, integrate it into index.js so it will run with the bot.