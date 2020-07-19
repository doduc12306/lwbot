const logger = require('./Logger');
const readdir = require('util').promisify(require('fs-extra').readdir);
const { Guild } = require('discord.js');
const { unlink } = require('fs-extra');
const { join } = require('path');

const config = require('../config');

module.exports.runner = async function runner(client, guild, reset = false) {
  const force = { force: reset };

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
    const GuildSettings = require('../dbFunctions/message/settings');
    const settingsTable = new GuildSettings(guild).shortcut;

    await settingsTable.sync(force);
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
    if (client.guilds.cache.get(guild)) client.guilds.cache.get(guild).settings = settings;
    logger.sqLog(`${guild}: Finished settings cleanup`);

    /* COMMANDS CLEANUP */
    const commandsTable = require('../dbFunctions/message/commands').functions.commandsSchema(guild);
    await commandsTable.sync(force);
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

    /* EVENT DB CLEANUP */
    const GuildEvents = require('../dbFunctions/message/events');
    const eventsTable = new GuildEvents(guild).shortcut;

    await eventsTable.sync(force);
    const events = {};
    for (const event of Object.entries(config.defaultEvents)) {
      const eventName = event[0];
      const enabled = event[1];

      await eventsTable.findOrCreate({ where: { event: eventName }, defaults: { enabled } })
        .then(event => {
          event = event[0];
          events[event.dataValues.event] = event.dataValues.enabled;
        }).catch(e => logger.error(e));
    }
    await eventsTable.sync();
    client.events.set(guild, events);
    client.guilds.cache.get(guild).events = events;
    logger.sqLog(`${guild}: Finished events cleanup`);

    /* XP CLEANUP */
    const xpTable = require('../dbFunctions/message/xp').functions.xpSchema(guild);
    await xpTable.sync(force);

    await xpTable.findAll().then(data => {
      for (const dataPoint of data) {
        increment(xpTable, dataPoint);
      }
    });
    logger.sqLog(`${guild}: Finished xp cleanup`);

    /* WORD FILTER CLEANUP */
    const GuildWordFilter = require('../dbFunctions/message/wordFilter');
    const wordFilter = new GuildWordFilter(guild);
    await wordFilter.shortcut().sync(force);

    const words = await wordFilter.words;
    client.guilds.cache.get(guild).wordFilter = words;
    logger.sqLog(`${guild}: Finished word filter cleanup!`);

    logger.sqLog(`${guild}: Finished process! ${new Date() - start}`);

    return true;

  } else { // If there was no guild passed, run for everything.

    logger.sqLog('Starting process for all servers...');
    const servers = await readdir('databases/servers/');

    // Begin cleanup process...
    await Promise.all(servers.map(async server => {
      if (server === 'x.txt') return logger.sqLog('Found x.txt - Placeholder file. Ignored, continuing.');

      const serverID = server.split('.sqlite')[0];
      if (!server.endsWith('.sqlite')) return logger.error('Non-sqlite file found in databases/servers! File: ' + server);
      if (!/\d+/g.test(server)) logger.warn('Non-server file found in databases/servers! File: ' + server);

      logger.sqLog(`Found ${server}`);

      // Run through all the databases to make sure they have a guild
      const clientGuild = client.guilds.cache.get(serverID);
      if (!clientGuild) {
        client.logger.warn(`Found guild database ${server} without guild in client collection. Deleting...`);
        const toDelete = join(__dirname, `../databases/servers/${server}`);
        client.logger.verbose(toDelete);
        return unlink(toDelete, err => {
          if (err) throw err;
          client.logger.sqLog(`Deleted database ${server} because it had no presence in client guild collection.`);
        });
      }

      // Run through all the guilds to make sure they have a database
      client.guilds.cache.forEach(guild => {
        // Separate the .sqlite extention from the server ID
        const serversWithout_dotSqlite = servers.map(g => g.split('.sqlite')[0]);

        // If a guild exists, but a database for the guild does not, create one.
        if (!serversWithout_dotSqlite.includes(guild.id)) {
          client.logger.warn(`Found guild (${guild.id}) but no corresponding database. Creating one now...`);
          this.runner(client, guild.id);
        }
      });

      /* SETTINGS CLEANUP */
      const GuildSettings = require('../dbFunctions/message/settings');
      const settingsTable = new GuildSettings(serverID).shortcut;

      await settingsTable.sync(force);
      const settings = {};
      for (const setting of Object.entries(config.defaultSettings)) {
        const key = setting[0];
        const value = setting[1];

        await settingsTable.findOrCreate({ where: { key }, defaults: { value } })
          .then(setting => {
            setting = setting[0];
            settings[setting.dataValues.key] = setting.dataValues.value;
          }).catch(e => logger.error(e));
      }
      await settingsTable.sync();
      client.settings.set(serverID, settings);
      client.guilds.cache.get(serverID).settings = settings;
      logger.sqLog(`${serverID}: Finished settings cleanup`);


      /* COMMANDS CLEANUP */
      const commandsTable = require('../dbFunctions/message/commands').functions.commandsSchema(serverID);
      await commandsTable.sync(force);
      for (const command of client.commands.filter(g => g.conf.enabled)) {
        const folder = client.folder.get(command[0]);
        const enabled = command[1].conf.enabled;
        const permLevel = command[1].conf.permLevel;

        await commandsTable.findOrCreate({ where: { command: command[0], permLevel }, defaults: { folder, enabled } })
          .catch(async e => {
            if (e.name === 'SequelizeUniqueConstraintError') {
              await commandsTable.destroy({ where: { command: command[0] } }).catch(e => logger.error(e));
              await commandsTable.create({ command: command[0], permLevel, folder, enabled }).catch(e => logger.error(e));
              await commandsTable.sync();
            }
            else logger.error(e);
          });
      }
      await commandsTable.sync();
      logger.sqLog(`${serverID}: Finished commands cleanup`);

      /* EVENT DB CLEANUP */
      const GuildEvents = require('../dbFunctions/message/events');
      const eventsTable = new GuildEvents(serverID).shortcut;

      await eventsTable.sync(force);
      const events = {};
      for (const event of Object.entries(config.defaultEvents)) {
        const eventName = event[0];
        const enabled = event[1];

        await eventsTable.findOrCreate({ where: { event: eventName }, defaults: { enabled } })
          .then(event => {
            event = event[0];
            events[event.dataValues.event] = event.dataValues.enabled;
          }).catch(e => logger.error(e));
      }
      await eventsTable.sync();
      client.events.set(serverID, events);
      client.guilds.cache.get(serverID).events = events;
      logger.sqLog(`${serverID}: Finished events cleanup`);


      /* XP CLEANUP */
      const xpTable = require('../dbFunctions/message/xp').functions.xpSchema(serverID);
      await xpTable.sync(force);

      await xpTable.findAll().then(data => {
        for (const dataPoint of data) {
          increment(xpTable, dataPoint);
        }
      });
      logger.sqLog(`${serverID}: Finished xp cleanup`);

      /* WORD FILTER CLEANUP */
      const GuildWordFilter = require('../dbFunctions/message/wordFilter');
      const wordFilter = new GuildWordFilter(serverID);
      await wordFilter.shortcut().sync(force);

      const words = await wordFilter.words;
      client.guilds.cache.get(serverID).wordFilter = words;
      logger.sqLog(`${serverID}: Finished word filter cleanup!`);

    }));
    logger.sqLog(`Process completed! Took ${new Date() - start}ms`);
    return true;

  }
};

module.exports.timer = (client) => {
  logger.sqLog('Watchdog started');
  return setInterval(() => this.runner(client), config.debugMode ? 30000 : 600000); // If debugMode, run every 30 seconds. If not, run every 10 minutes.
};

function xpNeededToLevelUp(x) {
  return 5 * (10 ** -4) * ((x * 100) ** 2) + (0.5 * (x * 100)) + 100;
}

async function increment(xpTable, dataPoint) {
  await xpTable.findOne({ where: { user: dataPoint.dataValues.user } })
    .then(async user => {
      let currentLevel = user.get('level');
      while (xpNeededToLevelUp(user.dataValues.level) < user.dataValues.xp) { currentLevel++; return true; }
      xpTable.update({ level: currentLevel }, { where: { user: dataPoint.dataValues.user } });
    });
}