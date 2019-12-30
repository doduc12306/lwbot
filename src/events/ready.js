const { Collection } = require('discord.js');
const moment = require('moment');
const watchdog = require('../util/sqWatchdog');
const failoverWSS = require('../util/ws-failover-server');
const Websocket = require('ws');
//const brain = require('brain.js');
const { readdirSync } = require('fs');
const { join } = require('path');

module.exports = async client => {
  if (!client.user.bot) {
    client.logger.error(`The user I logged in with, ${client.user.tag}, is not a bot!`);
    client.logger.error('This is strictly against the Discord Terms of Service!');
    client.logger.error('• http://discordapp.com/terms');
    client.logger.error('I will now exit FOR YOUR OWN SAFETY! I am protecting your account from getting banned!');
    process.exit(1);
  }

  require('../dbFunctions/client/tags.js')(client);
  require('../dbFunctions/client/protos.js')(client);

  client.tags.sync();

  client.logger.verbose(`

      ______ ______  _____  _____  _   _    _____  _____   ______   ___   _   _
      |  ___|| ___ \\|  _  ||_   _|| | | |  |_   _||_   _|  |  _  \\ / _ \\ | \\ | |
      | |_   | |_/ /| | | |  | |  | |_| |    | |    | |    | | | |/ /_\\ \\|  \\| |
      |  _|  |    / | | | |  | |  |  _  |    | |    | |    | | | ||  _  || . ' |
      | |    | |\\ \\ \\ \\_/ /  | |  | | | |   _| |_   | |    | |/ / | | | || |\\  |
      \\_|    \\_| \\_| \\___/   \\_/  \\_| |_/   \\___/   \\_/    |___/  \\_| |_/\\_| \\_/


  `);

  client.statusRotationInterval = setInterval(() => {
    const { statuses, enabled } = require('../util/statuses');
    if (!enabled) return false;
    const randomPl = statuses(client).randomElement();
    return client.user.setActivity(`${randomPl[0]} | !w help`, randomPl[1]);
  }, 60000);

  if (!client.config.ciMode) {
    // Finds if there was an error generated on uncaughtException the last time the bot started up.
    // This is achieved by writing a new file on error, exiting, then on restart, reading the file
    // then sending the contents to me.
    try {
      const fs = require('fs-extra');
      let e = require.resolve('../e');
      e = await fs.readFileSync('e', 'utf8');
      await client.users.get(client.config.ownerID).send(`**I restarted! There was an error before I restarted:**\n\`\`\`${e}\`\`\``);
      await fs.unlink('e', (err) => {
        if (err) throw err;
        client.logger.log('Error log reported, now deleted.');
      });
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') client.logger.debug('No error log found.');
      else client.logger.error(e.stack);
    }
  }

  // Define all client variables before they're called elsewhere
  client.settings = new Collection();
  client.xpLockSet = new Set();
  client.msgCmdHistory = new Collection();
  client.musicQueue = new Collection();

  // Run the watchdog once before ready
  client.logger.log('Running watchdog once before full startup...');
  const wasSqLogEnabled = client.config.sqLogMode; // boolean
  if (!wasSqLogEnabled) { client.logger.log('Enabling sqLogMode temporarily while it runs...'); client.config.sqLogMode = true; }
  if (client.config.ciMode) await watchdog.runner(client, client.guilds.get('332632603737849856'));
  else await watchdog.runner(client);
  if (!wasSqLogEnabled) { client.logger.log('Disabling sqLogMode because it was disabled originally...'); client.config.sqLogMode = false; }

  // Start the sqWatchdog interval timer
  watchdog.timer(client);

  if (!global.failover) { // If this is the main process (aka not failover mode)
    // Create the websocket server, and pass the client in
    failoverWSS(client);
    // This is handled in another file because it would clutter this one.
  } else { // If this is the failover process (aka failover mode)
    client.logger.warn('Failover mode enabled. Websocket server not started.');

    const reconnectionTimer = setInterval(reconnect, 1000);
    function reconnect() { // eslint-disable-line no-inner-declarations
      const ws = new Websocket('ws://localhost:13807');

      // Websocket connection encountered an error.
      ws.on('error', err => {
        if (err.code === 'ECONNREFUSED') { client.logger.verbose('Main process reconnection failed. Assuming it is still offline. Retrying...'); }
        else {
          client.logger.error(`FAILOVER ERROR: ${err}\n\nPROCESS WILL NOW EXIT`);
          process.exit(1);
        }
      });

      // Reconnection established!
      ws.on('open', () => {
        client.logger.log('Main process reconnected!', 'ready');
        ws.send(JSON.stringify({ action: 'reconnect' }));
        clearInterval(reconnectionTimer);
        // Don't exit the process here because the server will close it for me
      });

      // Connection was closed.
      ws.on('close', (code, reason) => {
        if (code === 1006) return; // Code 1006 = Connection does not exist
        client.logger.log(`Failover websocket connection closed gracefully. \nCode: ${code} | Reason: ${reason}`);

        if (process.env.pm_uptime) {
          client.logger.log('Restarting using PM2...');
          process.exit();
        } else {
          client.logger.warn('Process is not running via PM2. Manual restart required.');
          process.exit();
        }
      });
    }

  }

  // Initialize the brains
  const brains = readdirSync('brains/');
  const brainsWithoutJson = brains.map(g => g.split('.json')[0]);
  client.guilds.forEach(guild => {
    //guild.brain = new brain.recurrent.LSTM({ hiddenLayers: [20, 20, 20] });

    if (brainsWithoutJson.includes(guild.id)) return guild.brain.fromJSON(`${join(__dirname, 'brains/')}/${guild.id}.json`);
  });

  const after = new Date();
  client.startup = after - client.before;

  if (client.config.debugMode) client.logger.debug('Debug mode enabled');
  if (client.config.verboseMode) client.logger.verbose('Verbose mode enabled');
  if (client.config.sqLogMode) client.logger.sqLog('SQLog mode enabled');
  client.logger.log(`
${'⎻'.repeat(client.user.tag.length + client.user.id.length + 5)}
 ${client.user.tag} (${client.user.id})
${'⎼'.repeat(client.user.tag.length + client.user.id.length + 5)}
• Users:     ${client.users.size}
• Guilds:    ${client.guilds.size}
• Channels:  ${client.channels.size}
• Took:      ${moment.duration(client.startup, 'milliseconds').format('[~]s [secs]')} to start up`, 'ready');

  if (client.config.ciMode) client.emit('ciStepGuildCreate');
};