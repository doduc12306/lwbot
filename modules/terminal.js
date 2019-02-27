const Discord = require('discord.js');
const client = new Discord.Client();
const moment = require('moment');
require('moment-duration-format');
const term = require('terminal-kit').terminal;
const { inspect } = require('util');
const timestamp = `^K[${moment().format('YYYY-MM-DD HH:mm:ss')}]^ `;

const { join } = require('path');
require('dotenv').config({ path: join(__dirname, '../.env') });

let curServer;
let curChannel;

term.info = text => term(`${timestamp}^#^B[INFO]^ ^B${text}\n`);
term.log = text => term(`${timestamp}${text}\n`);
term.err = text => term(`\n${timestamp}^#^R^k[ERROR]^ ^r${text}\n`);
term.warn = text => term(`${timestamp}^#^y^k[WARN]^ ^y${text}\n`);

if(process.argv.includes('-d') || process.argv.includes('--debug')) client.login(process.env.DEBUG_TOKEN);
else client.login(process.env.TOKEN);

client.on('ready', () => {
  curServer = client.guilds.get('332632603737849856');
  curChannel = curServer.channels.get('332632603737849856');
  console.clear();
  term(`${timestamp}^#^G^k[READY]^ ^GTerminal client^ ^#^R^kr^#^ye^#^Ga^#^Bd^#^my^:^G! ^GLogged in as^ ^#^B^k${client.user.tag}^ ^K^/(${client.user.id})\n`);
  term.info(`Set current server to ^W${curServer.name} ^:^K^/(${curServer.id})`);
  term.info(`Set current channel to ^W#${curChannel.name} ^:^K^/(${curChannel.id})`);
  s();
});
/* eslint-disable */
client.on('message', async message => {
  // Message formatting
  message.formattedContent = message.cleanContent
    /* .replace(/(\*{1})([^\*]*)(\*{1})/g, match => {
      console.log(`Italic: ${match}`);
      return `^/${match.substring(1, match.length - 1)}^:`
    }) /* Italic terminal formatting */
    /* .replace(/(\*{2})([^\*]*)(\*{2})/g, match => {
      console.log(`Bold: ${match}`);
      return `^+${match.substring(2, match.length - 2)}^:`
    }) /* Bold terminal formatting */

  if(curServer !== message.guild) return;
  if(curChannel !== message.channel) return;
  if (message.cleanContent === 'terminal.exit' && message.author.id === '107599228900999168') {console.clear(); process.exit();}
  if (message.cleanContent === 'terminal.input' && message.author.id === '107599228900999168') s();

  const mentionedColor = message.isMemberMentioned(client.user) || message.isMemberMentioned(client.users.get('107599228900999168')) ? '^#^y^k' : '^:';

  term.colorRgbHex((message.member.displayColor).toString(16)).bold(message.member.displayName)(message.author.bot ? '^ ^#^B[BOT]^ ' : '')(` ^K^/${moment(message.createdTimestamp).format('h:mma • M/DD/YYYY')}^:\n${mentionedColor}${message.formattedContent}^:\n`);
});

function s() {
  term.inputField({}, async (error, input) => {
    if(error) {term.err(error.stack); s();}

    if(input.startsWith(':')) {
      if(input === ':quit') {console.clear(); process.exit();}
      else if(input === ':clear') {console.clear(); s();}

      else if(input.startsWith(':channel')) {
        if(input.substring(9) === '') {term.err('You didn\'t give a channel name/id to switch to!'); return s();}
        parseChannel(input.substring(9).startsWith('#') ? input.substring(9).split('#')[1] : input.substring(9))
          .then(channel => {
            if(channel.permissionsFor(curServer.members.get(client.user.id)).serialize().VIEW_CHANNEL === false ||
               channel.permissionsFor(curServer.members.get(client.user.id)).serialize().READ_MESSAGES === false) return term.err('Cannot send messages to this channel!');
            curChannel = channel;
            term('\n');
            term.info(`Current channel switched to ^W#${channel.name}^ ^K^/(${channel.id})`);
            channel.fetchMessages({limit: 10}).then(messages => {
              messages = messages.sort((a, b) => a.createdTimestamp > b.createdTimestamp);
              messages.forEach(message => {
                var mentionedColor = message.isMemberMentioned(client.user) || message.isMemberMentioned(client.users.get('107599228900999168')) ? '^#^y^k' : '^:';
                if (message.author.bot) term.colorRgbHex((message.member.displayColor).toString(16)).bold(message.member.displayName)(`^ ^#^B[BOT]^ ^K^/${moment(message.createdTimestamp).format('h:mma • M/DD/YYYY')}^:\n${mentionedColor}${message.cleanContent}\n`);
                else term.colorRgbHex((message.member.displayColor).toString(16)).bold(message.member.displayName)(`^ ^K^/${moment(message.createdTimestamp).format('h:mma • M/DD/YYYY')}^:\n${mentionedColor}${message.cleanContent}\n`);
              });
              term.info('Finished fetching messages');
            });
          })
          .catch(e => {
            if (e.message === '[String Parse] Channel not found') return term.err('Could not find channel');
            term.err(e);
          });
        s();
      }

      else if(input.startsWith(':server')) {
        if(input.substring(8) === '') {term.err('You didn\'t give the name/id of a server to switch to!'); return s();}
        parseGuild(input.substring(8))
          .then(guild => {
            curServer = guild;
            term('\n');
            term.info(`Current server switched to ^W${guild.name}^ ^K^/(${guild.id})`);
            const channel = guild.channels.find(g => g.name === curChannel.name);
            if(channel === undefined || channel == null) {
              term.warn('No channel with previous name found. Please set a new one.');
            } else curChannel = guild.channels.find(g => g.name === curChannel.name);
          })
          .catch(e => term.err(e.stack));
        s();
      }

      else if(input.startsWith(':dm')) {
        if(input.substring(4) === '') return term.err('No text/name/id to dm!');
        //if(dmUser) client.users.get(dmUser).send(input.substring(4));
        s();
      }

      else if(input.startsWith(':eval')) {
        const message = {};
        message.guild = curServer;
        message.channel = curChannel;

        const token = client.token.split('').join('[^]{0,2}');
        const rev = client.token.split('').reverse().join('[^]{0,2}');
        const filter = new RegExp(`${token}|${rev}`, 'g');
        try {
          let output = eval(input.substring(6));
          if (output instanceof Promise || (Boolean(output) && typeof output.then === 'function' && typeof output.catch === 'function')) output = await output;
          output = inspect(output, { depth: 0, maxArrayLength: null });
          output = output.replace(filter, '[TOKEN]');
          output = clean(output);
          term('\n');
          term.log(output);
        } catch (error) {
          error = error.stack.split('\n'); // eslint-disable-line no-ex-assign
          term.err(`${error[0]}\n\t${error[1].trim()}`);
        }
        s();
      }

      else {
        if(curServer === undefined) term.err('There is no server set yet!');
        else if(curChannel === undefined) term.err('There is no channel set yet!');
        else {
          await term('\n');
          await curChannel.send(input);
        }
        s();
      }
    }

    else if(input === '') s();
    else {
      if (curServer === undefined) term.err('There is no server set yet!');
      else if (curChannel === undefined) term.err('There is no channel set yet!');
      else {
        await term('\n');
        await curChannel.send(input);
      }
      s();
    }
  });
}

process.on('unhandledRejection', error => {term.err(error.stack); process.exit(1);});
process.on('uncaughtException', error => {term.err(error.stack); process.exit(1);});
process.on('SIGINT', () => process.exit());


// Various functions
function parseChannel(data, outputType) {
  let channelObj;
  let parsedChannel;
  return new Promise((resolve, reject) => {
    if (!data) return reject(new TypeError('No data given to parse channel information'));

    if (typeof data === 'string') {
      parsedChannel = curServer.channels.get(data);
      if (!parsedChannel) {
        parsedChannel = curServer.channels.find(channel => channel.name === data);
        if (!parsedChannel) return reject(new Error('[String Parse] Channel not found'));
        else channelObj = parsedChannel;
      } else channelObj = parsedChannel;
    }

    else if (typeof data === 'object') {
      parsedChannel = curServer.channels.get(data.id);
      if (!parsedChannel) return reject(new Error('[Object Parse] Channel not found'));
      else channelObj = parsedChannel;
    }
    else { return reject(new Error(`Data ("${data}") could not be parsed into a channel. Must be either string or object.`)); }

    if (!outputType) return resolve(channelObj);
    else if (outputType.toLowerCase() === 'id') return resolve(channelObj.id);
    else if (outputType.toLowerCase() === 'name') return resolve(channelObj.name);
    else return reject(new TypeError('Unknown output type; must be "id" or "name"'));
  });
}

function parseGuild(data, outputType) {
  let parsedGuild;
  let guildObj;
  return new Promise((resolve, reject) => {
    if (!data) return reject(new TypeError('No data given to parse guild information'));
    if(typeof data !== 'string') return reject(new TypeError('Data must be a string'));

    parsedGuild = client.guilds.get(data);
    if(parsedGuild === undefined) {
      parsedGuild = client.guilds.find(g => g.name === data);
      if(parsedGuild === undefined) return reject(new Error('Could not find guild'));
      else guildObj = parsedGuild;
    } else guildObj = parsedGuild;

    if (!outputType) return resolve(guildObj);
    else if (outputType.toLowerCase() === 'id') return resolve(guildObj.id);
    else if (outputType.toLowerCase() === 'name') return resolve(guildObj.name);
    else return reject(new TypeError('Unknown output type; must be "id" or "name"'));
  });
}

function clean(text) {
  return text
    .replace(/`/g, '`' + String.fromCharCode(8203))
    .replace(/@/g, '@' + String.fromCharCode(8203));
}