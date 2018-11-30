const { statuses } = require('../util/statuses');
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const Sequelize = require('sequelize');
const Discord = require('discord.js');
module.exports = async client => {
  setInterval(() => {
    var randomPl = statuses.randomElement();
    client.user.setActivity(`${randomPl[0]} | !w help`, randomPl[1]);
  }, 60000);

  const servers = await readdir('databases/servers/');
  client.settings = new Discord.Collection();
  await Promise.all(servers.map(async (server) => {
    const serverId = server.split('.sqlite')[0];
    const db = new Sequelize('database', 'username', 'password', {logging: false, host: 'localhost', storage: `databases/servers/${server}`, dialect: 'sqlite'});
    client.logger.debug(`Opened server ${server}`);
    const [data] = await db.query('SELECT * FROM \'settings\'');
    const settings = {};
    data.forEach(({ key, value }) => {
      settings[key] = value;
    });
    client.settings.set(serverId, settings);
    client.logger.debug(`Mapped settings for ${server}`);
  }));

  var after = new Date();
  client.startup = after - client.before;
  client.tags.sync();
  await client.wait(1000);
  client.logger.log(`${client.user.tag} | ${client.users.size} Users | ${client.guilds.size} Guilds | Took ${client.startup}ms`, 'ready');
};