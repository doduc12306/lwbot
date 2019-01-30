if (process.version.slice(1).split('.')[0] < 8) throw new Error('Node 8.0.0 or higher is required. Update Node on your system.');

const Discord = require('discord.js');

const { promisify } = require('util');
let { readdir, writeFileSync } = require('fs');
readdir = promisify(readdir);
writeFileSync = promisify(writeFileSync);

const walk = require('walk');

const Enmap = require('enmap');

const { join } = require('path');
require('dotenv').config({ path: join(__dirname, '../.env') });

const client = new Discord.Client({
  fetchAllMembers: true,
  disabledEvents: ['TYPING_START', 'USER_NOTE_UPDATE', 'RELATIONSHIP_ADD', 'RELATIONSHIP_REMOVE'],
  ws: { large_threshold: 1000 }
});

client.config = require('./config.js');
client.logger = require('./util/Logger');
require('./modules/functions.js')(client);

client.commands = new Enmap();
client.aliases = new Enmap();
client.folder = new Enmap();

const init = async () => {
  client.before = new Date();
  // Here we load commands into memory, as a collection, so they're accessible
  // here and everywhere else.
  const options = { // walk module options
    followLinks: false
    , filters: ['Temp', '_Temp']
  };
  const cmdFiles = walk.walk('./commands/', options);
  client.logger.log('Loading commands...');
  cmdFiles.on('file', (root, fileStats, next) => {
    const cmdPath = require('os').platform().includes('win')
      ? root.substring(root.indexOf('commands\\') + 13) // Windows path finding
      : join(__dirname, root).substring(join(__dirname, root).indexOf('commands/') + 9); // Linux path finding

    client.loadCommand(cmdPath, fileStats.name);
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
      delete require.cache[require.resolve(`./events/${file}`)];
      await client.logger.log(`Loaded ${file}`);
    });
    await client.logger.log('All events finished loading!');

    // Generate a cache of client permissions for pretty perms
    client.levelCache = {};
    for (let i = 0; i < client.config.permLevels.length; i++) {
      const thisLevel = client.config.permLevels[i];
      client.levelCache[thisLevel.name] = thisLevel.level;
    }

    // Here we login the client.
    if (client.config.debugMode) client.login(process.env.DEBUG_TOKEN);
    else client.login(process.env.TOKEN);
  });

// End top-level async/await function.
};

init();

// These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
process.on('uncaughtException', (err) => {
  if (err.stack.trim().includes('at WebSocketConnection.onError')) {
    client.logger.log('Disconnected! Lost connection to websocket\n'+err.stack, 'disconnect');
    if(client.config.debugMode) return process.exit(1);
    writeFileSync('./e', 'lost connection to websocket', e => {
      if(e) console.error(e);
      else client.logger.debug('Wrote error log');
    });
  } else {
    client.logger.error(`Uncaught Exception: ${err}`);
    if(client.config.debugMode) return process.exit(1);
    writeFileSync('./e', err.stack, e => {
      if(e) console.error(e);
      else client.logger.debug('Wrote error log');
    });
  }

  process.exit(1);
});

process.on('unhandledRejection', err => {
  client.logger.error(`Unhandled rejection: ${err.stack}`);
});

process.on('SIGINT', async () => {
  console.log('');
  client.logger.log('SIGINT detected! Cleaning up and exiting...');
  await client.destroy();
  client.logger.log('Client destroyed. Exiting...');
  await process.exit();
});

client.on('disconnect', () => client.logger.log('Client disconnected!', 'disconnect'));
client.on('reconnecting', () => client.logger.log('Reconnecting...', 'reconnecting'));
client.on('resume', replayed => client.logger.log(`Client resumed! Replayed ${replayed} events`, 'resume'));
client.on('warn', info => client.logger.warn(`Warning: "${info}"`));

// lwbot-rewrite - Discord bot
// Copyright (C) 2017-2019 Samir Buch
// License is applicable to all files and folders within directory
