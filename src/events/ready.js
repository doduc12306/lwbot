/* eslint-disable no-useless-escape */
const { statuses } = require('../util/statuses');
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const Sequelize = require('sequelize');
const Discord = require('discord.js');
module.exports = async client => {
  setInterval(() => {
    const randomPl = statuses.randomElement();
    client.user.setActivity(`${randomPl[0]} | !w help`, randomPl[1]);
    client.verbose(`status set | Set playing status to ${randomPl[0]}, ${randomPl[1]}`);
  }, 60000);

  const servers = await readdir('databases/servers/');
  client.settings = new Discord.Collection();
  await Promise.all(servers.map(async (server) => {
    const serverId = server.split('.sqlite')[0];
    const db = new Sequelize('database', 'username', 'password', {logging: false, host: 'localhost', storage: `databases/servers/${server}`, dialect: 'sqlite'});
    client.verbose(`Opened server ${server}`);
    if(!server.endsWith('.sqlite')) return client.logger.error('Non-sqlite file found in databases/servers! File: ' + server);
    if(!/\d+/g.test(server)) client.logger.warn('Non-server file found in databases/servers! File: ' + server);
    const [data] = await db.query('SELECT * FROM \'settings\'');
    const settings = {};
    data.forEach(({ key, value }) => {
      settings[key] = value;
    });
    client.settings.set(serverId, settings);
    client.verbose(`Mapped settings for ${server}`);
  }));

  const after = new Date();
  client.startup = after - client.before;
  client.tags.sync();
  client.logger.log(`${client.user.tag} | ${client.users.size} Users | ${client.guilds.size} Guilds | Took ${client.startup}ms`, 'ready');
  if(client.config.debugMode) client.logger.warn('Debug mode enabled');
  if(client.config.verboseMode) client.logger.warn('Verbose mode enabled');

  await client.wait(5000);

  client.verbose(`

      ______ ______  _____  _____  _   _    _____  _____   ______   ___   _   _
      |  ___|| ___ \|  _  ||_   _|| | | |  |_   _||_   _|  |  _  \ / _ \ | \ | |
      | |_   | |_/ /| | | |  | |  | |_| |    | |    | |    | | | |/ /_\ \|  \| |
      |  _|  |    / | | | |  | |  |  _  |    | |    | |    | | | ||  _  || . ' |
      | |    | |\ \ \ \_/ /  | |  | | | |   _| |_   | |    | |/ / | | | || |\  |
      \_|    \_| \_| \___/   \_/  \_| | _/  \___/   \_/    |___/  \_| |_/\_| \_/


  `);



  // Finds if there was an error generated on uncaughtException the last time the bot started up.
  // This is achieved by writing a new file on error, exiting, then on restart, reading the file
  // then sending the contents to me.
  try {
    const fs = require('fs');
    let e = require.resolve('../e');
    e = await fs.readFileSync('e', 'utf8');
    await client.users.get(client.config.ownerID).send(`**I restarted! There was an error before I restarted:**\n\`\`\`${e}\`\`\``);
    await fs.unlink('e', (err) => {
      if(err) throw err;
      client.logger.log('Error log reported, now deleted.');
    });
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') return client.logger.debug('No error log found.');
    else client.logger.error(e.stack);
  }
};