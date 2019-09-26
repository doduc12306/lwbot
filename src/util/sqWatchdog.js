const logger = require('./Logger');
const readdir = require('util').promisify(require('fs').readdir);
const { Guild } = require('discord.js');

const config = require('../config');

module.exports.runner = async function runner(client, guild) {
  if (!client) throw new Error('Missing client parameter');
  const start = new Date();

  // If there was a specific guild passed, run the process for only that guild.
  if (guild) { // This is pretty much the same process as the run-all version, except with only one guild.

    if (guild instanceof Guild) {
      logger.warn('Guild object passed to runner when guild ID was expected. Converting...');
      guild = guild.id;
    } // Checks to make sure we're inputting a guild ID, and not a whole guild object
    logger.sqLog(`Starting process for ${guild}...`);

    /* SETTINGS CLEANUP */
    const settingsTable = require('../dbFunctions/message/settings').functions.settingsSchema(guild);
    await settingsTable.sync();

    const settings = {};
    for (const setting of Object.entries(config.defaultSettings)) {
      const key = setting[0];
      const value = setting[1];

      await settingsTable.findOrCreate({ where: { key: key }, defaults: { value: value } })
        .then(setting => {
          setting = setting[0];
          settings[setting.dataValues.key] = setting.dataValues.value;
        }).catch(e => logger.error(e));
    }
    await settingsTable.sync();
    client.settings.set(guild, settings);
    logger.sqLog(`${guild}: Finished settings cleanup`);

    /* COMMANDS CLEANUP */
    const commandsTable = require('../dbFunctions/message/commands').functions.commandsSchema(guild);
    await commandsTable.sync();
    for (const command of client.commands.filter(g => g.conf.enabled)) {
      const folder = client.folder.get(command[0]);
      const enabled = command[1].conf.enabled;
      const permLevel = command[1].conf.permLevel;

      await commandsTable.findOrCreate({ where: { command: command[0], permLevel: permLevel }, defaults: { folder: folder, enabled: enabled } })
        .catch(async e => {
          if (e.name === 'SequelizeUniqueConstraintError') { // If command exists with different properties, overwrite it.
            await commandsTable.destroy({ where: { command: command[0] } }).catch(e => logger.error(e));
            await commandsTable.create({ command: command[0], permLevel: permLevel, folder: folder, enabled: enabled }).catch(e => logger.error(e));
            await commandsTable.sync();
          }
          else logger.error(e);
        });
    }
    await commandsTable.sync();
    logger.sqLog(`${guild}: Finished commands cleanup`);

    // TODO: Add in XP cleanup. See https://gitlab.com/akii0008/lwbot-rewrite/issues/3

    logger.sqLog(`${guild}: Finished process! ${new Date() - start}`);
    return true;

  } else { // If there was no guild passed, run for everything.

    logger.sqLog('Starting process for all servers...');
    const servers = await readdir('databases/servers/');

    // Run through all the guilds to make sure they have a database
    client.guilds.forEach(guild => {
      // Separate the .sqlite extention from the server ID
      const serversWithout_dotSqlite = servers.map(g => g.split('.sqlite')[0]);

      // If a guild exists, but a database for the guild does not, create one.
      if(!serversWithout_dotSqlite.includes(guild.id)) {
        client.logger.warn(`Found guild (${guild.id}) but no corresponding database. Creating one now...`);
        this.runner(client, guild.id);
      } else client.logger.sqLog(`Found guild (${guild.id}) with corresponding database.`);
    });

    // Begin cleanup process...
    await Promise.all(servers.map(async server => {
      if (server === 'x.txt') return logger.sqLog('Found x.txt - Placeholder file. Ignored, continuing.');

      const serverID = server.split('.sqlite')[0];
      logger.sqLog(`Found ${serverID}`);
      if (!server.endsWith('.sqlite')) return logger.error('Non-sqlite file found in databases/servers! File: ' + server);
      if (!/\d+/g.test(server)) logger.warn('Non-server file found in databases/servers! File: ' + server);

      /* SETTINGS CLEANUP */
      const settingsTable = require('../dbFunctions/message/settings').functions.settingsSchema(serverID);
      await settingsTable.sync();

      const settings = {};
      for (const setting of Object.entries(config.defaultSettings)) {
        const key = setting[0];
        const value = setting[1];

        await settingsTable.findOrCreate({ where: { key: key }, defaults: { value: value } })
          .then(setting => {
            setting = setting[0];
            settings[setting.dataValues.key] = setting.dataValues.value;
          }).catch(e => logger.error(e));
      }
      await settingsTable.sync();
      client.settings.set(serverID, settings);
      logger.sqLog(`${serverID}: Finished settings cleanup`);


      /* COMMANDS CLEANUP */
      const commandsTable = require('../dbFunctions/message/commands').functions.commandsSchema(serverID);
      await commandsTable.sync();
      for (const command of client.commands.filter(g => g.conf.enabled)) {
        const folder = client.folder.get(command[0]);
        const enabled = command[1].conf.enabled;
        const permLevel = command[1].conf.permLevel;

        await commandsTable.findOrCreate({ where: { command: command[0], permLevel: permLevel }, defaults: { folder: folder, enabled: enabled } })
          .catch(async e => {
            if (e.name === 'SequelizeUniqueConstraintError') {
              await commandsTable.destroy({ where: { command: command[0] } }).catch(e => logger.error(e));
              await commandsTable.create({ command: command[0], permLevel: permLevel, folder: folder, enabled: enabled }).catch(e => logger.error(e));
              await commandsTable.sync();
            }
            else logger.error(e);
          });
      }
      await commandsTable.sync();
      logger.sqLog(`${serverID}: Finished commands cleanup`);


      /* XP CLEANUP */
      const xpTable = require('../dbFunctions/message/xp').functions.xpSchema(serverID);
      await xpTable.sync();

      /* await xpTable.findAll().then(data => {
        for (const dataPoint of data) {
  
          // eslint disabled to prevent it from picking up on this increment function here
          // eslint-disable-next-line no-inner-declarations
          async function increment() {
            await xpTable.findOne({ where: { user: dataPoint.dataValues.user } })
              .then(async user => {
                if (xpNeededToLevelUp(user.dataValues.level) < user.dataValues.xp) { await user.increment('level'); await increment(); return true; }
                else return false;
  
                function xpNeededToLevelUp(x) {
                  return 5 * (10 ** -4) * ((x * 100) ** 2) + (0.5 * (x * 100)) + 100;
                }
              });
          }
          while (increment()) increment();
  
        }
  
      }); */ // Disabled because increment function is moving too fast for node to handle. Related issue: https://gitlab.com/akii0008/lwbot-rewrite/issues/3
      // logger.sqLog(`${serverID}: Finished xp cleanup`);

    }));
    logger.sqLog(`Process completed! Took ${new Date() - start}ms`);
    return true;

  }

};

module.exports.timer = (client) => {
  logger.sqLog('Watchdog started');
  setInterval(() => this.runner(client), config.debugMode ? 30000 : 600000); // If debugMode, run every 30 seconds. If not, run every 10 minutes.
};