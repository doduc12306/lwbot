const logger = require('./Logger');
const readdir = require('util').promisify(require('fs').readdir);

const config = require('../config');

module.exports = async (client) => {
  logger.log('Watchdog started');

  const time = config.debugMode ? 30000 : 600000; // If debug mode is on, refresh every 30 seconds. Else, 10 minutes.

  setInterval(async () => {
    const start = new Date();
    logger.sqLog('Started process...');

    const servers = await readdir('databases/servers/');
    await Promise.all(servers.map(async server => {
      const serverID = server.split('.sqlite')[0];
      if(server === 'x.txt') return logger.sqLog('Found x.txt - Placeholder file. Ignored, continuing.');

      logger.sqLog(`Opened server ${server}`);
      if (!server.endsWith('.sqlite')) return logger.error('Non-sqlite file found in databases/servers! File: ' + server);
      if (!/\d+/g.test(server)) logger.warn('Non-server file found in databases/servers! File: ' + server);

      /* SETTINGS CLEANUP */
      const settingsTable = require('../dbFunctions/message/settings').functions.settingsSchema(serverID);
      await settingsTable.sync();

      for (const setting of Object.entries(config.defaultSettings)) {
        const key = setting[0];
        const value = setting[1];

        await settingsTable.findOrCreate({ where: { key: key }, defaults: { value: value } });
      }
      await settingsTable.sync();
      logger.sqLog('Finished settings cleanup');


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
              await commandsTable.destroy({ where: { command: command[0] } });
              await commandsTable.create({ command: command[0], permLevel: permLevel, folder: folder, enabled: enabled });
              await commandsTable.sync();
            }
            else logger.error(e);
          });
      }
      await commandsTable.sync();
      logger.sqLog('Finished commands cleanup');

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

      }); */ // Disabled because increment function is moving too fast. https://gitlab.com/akii0008/lwbot-rewrite/issues/3
      logger.sqLog('Finished xp cleanup');

    }));

    logger.sqLog(`Ended process! ${new Date() - start}ms`);
  }, time);


};