const { join } = require('path');
require('dotenv').config({ path: join(__dirname, '../.env') });
const commandLineArgs = require('command-line-args');
const Discord = require('discord.js');
const { promisify } = require('util');
const fs = require('fs-extra');
const walk = require('walk');
const Enmap = require('enmap');
const moment = require('moment');
const compressing = require('compressing');

const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);
const remove = promisify(fs.remove);

// Export the client for other files' usage
module.exports.client = new Discord.Client({
  fetchAllMembers: true,
  disabledEvents: ['TYPING_START', 'USER_NOTE_UPDATE', 'RELATIONSHIP_ADD', 'RELATIONSHIP_REMOVE'],
  ws: { large_threshold: 1000 }
});

module.exports.startup = async () => {
  if (global.failover) console.warn('FAILOVER INITIATED!');

  /* SECTION: CLI ARGUMENTS PARSING */
  const options = commandLineArgs([
    // Modes
    { name: 'debug', alias: 'd', type: Boolean },
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'sqLog', alias: 's', type: Boolean },
    { name: 'ciMode', type: Boolean },

    // Tokens
    { name: 'token', type: String },
    { name: 'debugToken', type: String },
    { name: 'googleAPIKey', type: String },

    // Options
    { name: 'noFileLog', type: Boolean },
    { name: 'noFailoverWebsocket', type: Boolean }
  ]);

  const client = this.client;
  client.config = require('./config.js');

  // This is down here because client isn't defined by the time cli args are.
  if (options.debug) client.config.debugMode = true;
  if (options.verbose) client.config.verboseMode = true;
  if (options.sqLog) client.config.sqLogMode = true;
  if (options.token) process.env.TOKEN = options.token;
  if (options.debugToken) process.env.DEBUG_TOKEN = options.debugToken;
  if (options.googleAPIKey) process.env.GOOGLE_API_KEY = options.googleAPIKey;
  if (options.noFileLog) client.config.noFileLog = true;
  /* END SECTION */

  /* SECTION: CLIENT DEFINITIONS */
  client.commands = new Enmap(); // Where all the commands are kept
  client.aliases = new Enmap(); // Where all the aliases to each command are kept
  client.folder = new Enmap(); // Where all command categories are kept
  client.cooldowns = new Enmap(); // Where all user-command cooldowns are kept
  client.logger = require('./util/Logger'); // Logger class interface for the rest of the client

  client.logger.log('STARTING BOT...');

  require('./dbFunctions/client/misc.js')(client);
  require('./dbFunctions/client/protos.js')(client);

  client.before = new Date(); // Boot timestamp - Initial
  /* END SECTION */
  
  const curDay = moment().format('YYYY-MM-DD');
  function makeLogsForToday() {
    /* SECTION: LOG DIRECTORY CREATION */
    mkdir(`logs/${curDay}`, { recursive: true })
      .then(() => client.logger.log(`Created log directory for today: ${curDay}`))
      .catch(e => {
        if (e.code === 'EEXIST') return;
        else client.logger.log(e);
      });
  /* END SECTION */
  }
  if(!client.config.noFileLog) makeLogsForToday();

  /* SECTION: LOG COMPRESSION */
  await compressLogs();
  async function compressLogs() {
    const logsDir = await readdir('./logs');

    for (const log of logsDir) {
      const logIsDir = await stat(`./logs/${log}`).then(g => g.isDirectory());
      if (log !== curDay && logIsDir) { // Start compressiom
        client.logger.log(`Found uncompressed log, ${log}. Compressing now...`);
        compressing.tgz.compressDir(`./logs/${log}`, `./logs/${log}.tar.gz`)
          .then(async () => { await remove(`./logs/${log}`).then(() => client.logger.log(`Compression of ./logs/${log} complete`)); })
          .catch(e => client.logger.error(`There was an error compressing ./logs/${log}:\n\t${e}`));
      }
    }
  }
  setInterval(compressLogs, 8.64e+7); // Run the compressLogs function every 24 hours.
  /* END SECTION */

  if (options.ciMode) { // If CI mode was enabled,
    client.config.ciMode = true; // ... enable ci mode in the config
    client.config.debugMode = true; // ... enable debug mode (debug bot)
    client.config.verboseMode = true; // ... enable verbose logging
    client.config.noFileLog = true; // ... disable logging to files

    client.logger.debug('CI MODE ENABLED - RUNNING TESTS AND EXITING');
    return require('./util/ci')(client); // ... and run the CI test suite
  }

  /* SECTION: COMMAND LOADING */
  // Here we load commands into memory, as a collection, so they're accessible here and everywhere else
  const cmdFiles = walk.walk('./commands/', { followLinks: false, filters: ['Temp', '_Temp'] });
  client.logger.log('Loading commands...');
  let cmdCount = 0;
  cmdFiles.on('file', (root, fileStats, next) => {
    const cmdPath = require('os').platform().includes('win')
      ? root.substring(root.indexOf('commands\\') + 13) // Windows path finding
      : join(__dirname, root).substring(join(__dirname, root).indexOf('commands/') + 9); // Linux path finding

    const response = client.loadCommand(cmdPath, fileStats.name);
    if (response) client.logger.error(response); // If there was an error loading the command, output it

    cmdCount++;
    next(); // Ready for the next command...
  });

  cmdFiles.on('end', async () => {
    await client.logger.log(`${cmdCount} commands finished loading!`);
    /* END SECTION */
    /* SECTION: EVENT LOADING */
    // Then we load events, which will include our message and ready event.
    const evtFiles = await readdir('./events/');
    client.logger.log(`Loading a total of ${evtFiles.length} events.`);
    evtFiles.forEach(async file => {
      const eventName = file.split('.')[0];
      const event = require(`./events/${file}`);
      client.on(eventName, event.bind(null, client));
      await client.logger.verbose(`Loaded ${eventName} event`);
    });
    await client.logger.log('All events finished loading!');
    /* END SECTION */

    /* SECTION: PERMISSION LEVEL GENERATION */
    // Generate a cache of client permissions for pretty perms
    client.levelCache = {};
    for (let i = 0; i < client.config.permLevels.length; i++) {
      const thisLevel = client.config.permLevels[i];
      client.levelCache[thisLevel.name] = thisLevel.level;
    }
    /* END SECTION */

    // Login to Discord websocket. Triggers 'ready' event on login
    client.login(client.config.debugMode ? process.env.DEBUG_TOKEN : process.env.TOKEN);
  });

  // Events that don't require their own files since they're so minor
  client.on('disconnect', () => client.logger.log('Client disconnected!', 'disconnect'));
  client.on('reconnecting', () => client.logger.log('Reconnecting...', 'reconnecting'));
  client.on('resume', replayed => client.logger.log(`Client resumed! Replayed ${replayed} events`, 'resume'));
  client.on('warn', info => client.logger.warn(`Warning: "${info}"`));

  // Error handling
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
        if (e || err) client.logger.error(`Error installing sqlite3 package: ${e || err}`);
        client.logger.log(out);
        if (process.env.pm_uptime) {
          client.logger.log('PM2 detected! Restarting using PM2...');
        } else client.logger.log('Please restart the bot.');
        process.exit();
      });
    }
    client.logger.error(`Unhandled rejection: ${err.stack}`);
  });

};