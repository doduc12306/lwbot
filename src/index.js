if (process.version.slice(1).split('.')[0] < 8 || process.version.slice(1).split('.')[0] > 11)
  return console.error('Invalid node.js version. Please choose a version from 8 to 11.');

const { join } = require('path');
require('dotenv').config({ path: join(__dirname, '../.env') });

const commandLineArgs = require('command-line-args');
const options = commandLineArgs([
  // Modes
  { name: 'debug', alias: 'd', type: Boolean },
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'sqLog', alias: 's', type: Boolean },
  { name: 'ciMode', type: Boolean },

  // Tokens
  { name: 'token', type: String },
  { name: 'debugToken', type: String },
  { name: 'googleAPIKey', type: String }
]);

const { promisify } = require('util');
const fs = require('fs');
const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

const walk = require('walk');

const Enmap = require('enmap');

const Discord = require('discord.js');
const client = new Discord.Client({
  fetchAllMembers: true,
  disabledEvents: ['TYPING_START', 'USER_NOTE_UPDATE', 'RELATIONSHIP_ADD', 'RELATIONSHIP_REMOVE'],
  ws: { large_threshold: 1000 }
});
client.config = require('./config.js');

client.commands = new Enmap();
client.aliases = new Enmap();
client.folder = new Enmap();
client.cooldowns = new Enmap();

client.before = new Date();

// This is down here because client isn't defined by the time cli args are.
if (options.debug) client.config.debugMode = true;
if (options.verbose) client.config.verboseMode = true;
if (options.sqLog) client.config.sqLogMode = true;
if (options.token) process.env.TOKEN = options.token;
if (options.debugToken) process.env.DEBUG_TOKEN = options.debugToken;
if (options.googleAPIKey) process.env.GOOGLE_API_KEY = options.googleAPIKey;

const currentDayLog = new Date().toDateString().replace(/ +/g, '-'); // Gets current date
mkdir(`logs/${currentDayLog}/`, { recursive: true }, e => { if(e) console.error(e); }); // Makes ../logs/ if it not already exist
client.logger = require('./util/Logger');

require('./dbFunctions/client/misc.js')(client);
require('./dbFunctions/client/protos.js')(client);

if (options.ciMode) {
  client.config.ciMode = true;
  client.config.debugMode = true;
  client.config.verboseMode = true;

  client.logger.debug('CI MODE ENABLED - RUNNING TESTS AND EXITING');
  return require('./util/ci')(client);
}

// Here we load commands into memory, as a collection, so they're accessible
// here and everywhere else.
const cmdFiles = walk.walk('./commands/', { followLinks: false, filters: ['Temp', '_Temp'] });
client.logger.log('Loading commands...');
cmdFiles.on('file', (root, fileStats, next) => {
  const cmdPath = require('os').platform().includes('win')
    ? root.substring(root.indexOf('commands\\') + 13) // Windows path finding
    : join(__dirname, root).substring(join(__dirname, root).indexOf('commands/') + 9); // Linux path finding

  const response = client.loadCommand(cmdPath, fileStats.name);
  if (response) client.logger.error(response);
  next();
});

cmdFiles.on('end', async () => {
  await client.logger.log('All commands finished loading!');
  // Then we load events, which will include our message and ready event.
  const evtFiles = await readdir('./events/');
  client.logger.log(`Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach(async file => {
    const eventName = file.split('.')[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
    await client.logger.log(`Loaded ${file}`);
  });
  await client.logger.log('All events finished loading!');

  // Generate a cache of client permissions for pretty perms
  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  client.login(client.config.debugMode ? process.env.DEBUG_TOKEN : process.env.TOKEN);
});

client.on('disconnect', () => client.logger.log('Client disconnected!', 'disconnect'));
client.on('reconnecting', () => client.logger.log('Reconnecting...', 'reconnecting'));
client.on('resume', replayed => client.logger.log(`Client resumed! Replayed ${replayed} events`, 'resume'));
client.on('warn', info => client.logger.warn(`Warning: "${info}"`));

// These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
process.on('uncaughtException', async (err) => {
  if (err.stack.trim().includes('at WebSocketConnection.onError')) {
    client.logger.log('Disconnected! Lost connection to websocket', 'disconnect');
    client.logger.log('Attempting reconnect...', 'reconnecting');
    await client.login(client.config.debugMode ? process.env.DEBUG_TOKEN : process.env.TOKEN)
      .then(() => { return client.logger.log('Client reconnected!', 'resume'); })
      .catch(() => {
        client.logger.log('Disconnected!', 'disconnect');
        if (client.config.debugMode) return process.exit(1);
        writeFile('./e', 'lost connection to websocket', e => {
          if (e) console.error(e);
          else client.logger.debug('Wrote error log');
        });
        process.exit(1);
      });
  } else {
    client.logger.error(`Uncaught Exception: ${err}`);
    if (client.config.debugMode) return process.exit(1);
    writeFile('./e', err.stack, e => {
      if (e) console.error(e);
      else client.logger.debug('Wrote error log');
    });
    process.exit(1);
  }

  process.exit(1); // Even if the previous don't run for whatever reason, this will.
});

process.on('unhandledRejection', err => {
  if (err.message === 'Please install sqlite3 package manually') {
    client.logger.error('sqlite3 package needs to be reinstalled.');
    client.logger.log('Installing package...');
    return require('child_process').exec('yarn add sqlite3', async (e, out, err) => {
      if (e || err) client.logger.error(`Error installing sqlite3 package: ${await e || await err}`);
      client.logger.log(await out);
      if(process.env._pm2_version) {
        client.logger.log('PM2 detected! Restarting using PM2...');
      } else client.logger.log('Please restart the bot.');
      await process.exit();
    });
  }
  client.logger.error(`Unhandled rejection: ${err.stack}`);
});

process.on('SIGINT', async () => {
  console.log('');
  client.logger.log('SIGINT detected! Cleaning up and exiting...');
  await client.destroy();
  client.logger.log('Client destroyed. Exiting...');
  await process.exit();
});

// lwbot-rewrite - Discord bot
// Copyright (C) 2017-2019 Samir Buch
// License is applicable to all files and folders within directory
