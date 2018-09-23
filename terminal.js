/* eslint-disable */
const Discord = require('discord.js');
const client = new Discord.Client();
const moment = require('moment');
require('moment-duration-format');
const config = require('./config.js');
var term = require('terminal-kit').terminal;
const { inspect } = require('util');
const timestamp = `^K[${moment().format('YYYY-MM-DD HH:mm:ss')}]^ `;

var curServer;
var curChannel;

term.info = text => term(`${timestamp}^ ^#^B[INFO]^ ^B${text}\n`);
term.log = text => term(`${timestamp}^ ${text}\n`);
term.err = text => term(`\n${timestamp}^ ^#^R^k[ERROR]^ ^r${text}\n`);
term.warn = text => term(`${timestamp} ^#^y^k[WARN]^ ^y${text}\n`)

client.login(config.token);

client.on('ready', () => {
  curServer = client.guilds.get('381192127050153993');
  curChannel = curServer.channels.get('438520896798326786');
  console.clear();
  term(`${timestamp}^ ^#^G^k[READY]^ ^GTerminal client^ ^#^R^kr^#^ye^#^Ga^#^Bd^#^my^:^G! ^GLogged in as^ ^#^B^k${client.user.tag}^ ^K^/(${client.user.id})\n`);
  term.info(`Set current server to ^W${curServer.name} ^:^K^/(${curServer.id})`);
  term.info(`Set current channel to ^W#${curChannel.name} ^:^K^/(${curChannel.id})`);
  s();
});
client.on('message', async message => {
  if(curServer !== message.guild) return;
  if(curChannel !== message.channel) return;
  if(message.content === `terminal.exit`) process.exit();
  if(message.content === `terminal.input`) s();

  if (message.author.bot) return term.colorRgbHex((message.member.displayColor).toString(16)).bold(message.member.displayName)(`^ ^#^B[BOT]^ ^K^/${moment(message.createdTimestamp).format('h:mma • M/DD/YYYY')}\n^:${message.cleanContent}\n`)
  term.colorRgbHex((message.member.displayColor).toString(16)).bold(message.member.displayName)(`^ ^K^/${moment(message.createdTimestamp).format('h:mma • M/DD/YYYY')}\n^:${message.cleanContent}\n`)
});
// ▬

function s(){
  term.inputField({}, async (error, input) => {
    if(error) {term.err(error.stack); s();}

    if(input.startsWith(':')){
      if(input === ":quit") {console.clear(); process.exit();}
      else if(input === ":clear") {console.clear(); s();}

      else if(input.startsWith(":channel")) {
        if(input.substring(9) === "") {term.err('You didn\'t give a channel name/id to switch to!'); return s();}
        parseChannel(input.substring(9).startsWith('#') ? input.substring(9).split('#')[1] : input.substring(9))
          .then(channel => {
            if(channel.permissionsFor(curServer.members.get(client.user.id)).serialize().VIEW_CHANNEL === false ||
               channel.permissionsFor(curServer.members.get(client.user.id)).serialize().READ_MESSAGES === false) return term.err('Cannot send messages to this channel!');
            curChannel = channel;
            term('\n');
            term.info(`Current channel switched to ^W#${channel.name}^ ^K^/(${channel.id})`)})
          .catch(e => {
            if (e.message === '[String Parse] Channel not found') return term.err('Could not find channel');
            term.err(e);
          });
        s();
      }

      else if(input.startsWith(':server')) {
        if(input.substring(8) === "") {term.err('You didn\'t give the name/id of a server to switch to!'); return s();}
        parseGuild(input.substring(8))
          .then(guild => {
            curServer = guild;
            term('\n');
            term.info(`Current server switched to ^W${guild.name}^ ^K^/(${guild.id})`);
            channel = guild.channels.find(g => g.name === curChannel.name);
            if(channel === undefined || channel == null) {
              term.warn('No channel with previous name found. Please set a new one.');
            } else curChannel = guild.channels.find(g => g.name === curChannel.name);
          })
          .catch(e => term.err(e.stack));
        s();
      }

      else {
        await term('\n');
        await curChannel.send(input);
        s();
      }
    }

    else if(input === "") s();
    else {
      await term('\n');
      await curChannel.send(input)
        .catch(e => term.err(e));
      s();
    }
  });
}

process.on('unhandledRejection', error => {term.err(error.stack); process.exit(1);});
process.on('uncaughtException', error => {term.err(error.stack); process.exit(1);});
process.on('SIGINT', () => process.exit());


// Various functions
function parseChannel(data, outputType) {
  var channelObj;
  var parsedChannel;
  return new Promise((resolve, reject) => {
    if (!data || data === null) return reject(new TypeError('No data given to parse channel information'));

    if (typeof data === 'string') {
      parsedChannel = curServer.channels.get(data);
      if (parsedChannel === undefined || parsedChannel === null) {
        parsedChannel = curServer.channels.find(channel => channel.name === data);
        if (parsedChannel === undefined || parsedChannel === null) return reject(new Error('[String Parse] Channel not found'));
        else channelObj = parsedChannel;
      } else channelObj = parsedChannel;
    }

    else if (typeof data === 'object') {
      parsedChannel = curServer.channels.get(data.id);
      if (parsedChannel === undefined || parsedChannel === null) return reject(new Error('[Object Parse] Channel not found'));
      else channelObj = parsedChannel;
    }
    else { return reject(new Error(`Data ("${data}") could not be parsed into a channel. Must be either string or object.`)); }

    if (!outputType || outputType === null) return resolve(channelObj);
    else if (outputType.toLowerCase() === 'id') return resolve(channelObj.id);
    else if (outputType.toLowerCase() === 'name') return resolve(channelObj.name);
    else return reject(new TypeError('Unknown output type; must be "id" or "name"'));
  });
}

function parseGuild(data, outputType) {
  var parsedGuild;
  var guildObj;
  return new Promise((resolve, reject) => {
    if (!data || data === null) return reject(new TypeError('No data given to parse guild information'));
    if(typeof data !== 'string') return reject(new TypeError('Data must be a string'));

    parsedGuild = client.guilds.get(data);
    if(parsedGuild === undefined) {
      parsedGuild = client.guilds.find(g => g.name === data);
      if(parsedGuild === undefined) return reject(new Error('Could not find guild'));
      else guildObj = parsedGuild;
    } else guildObj = parsedGuild;

    if (!outputType || outputType === null) return resolve(guildObj);
    else if (outputType.toLowerCase() === 'id') return resolve(guildObj.id);
    else if (outputType.toLowerCase() === 'name') return resolve(guildObj.name);
    else return reject(new TypeError('Unknown output type; must be "id" or "name"'));
  });
}