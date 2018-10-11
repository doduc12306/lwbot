const Sequelize = require('sequelize');

module.exports = async (client, guild) => {

  // Thanks for this PSA, York. This guild is full of userbots spamming commands. If this bot enters it, you'll see extreme performance issues.
  if(guild.id === '439438441764356097') return guild.leave();
  client.logger.log(`Joined guild ${guild.name} (${guild.id})`);

  var guildTable = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: `databases/servers/${guild.id}.sqlite`
  });

  // Guild settings intialization
  guild.settings = await guildTable.define('settings', {
    key: {
      type: Sequelize.STRING,
      allowNull: false
    },
    value: Sequelize.STRING
  }, {timestamps: false});
  await guildTable.sync();

  await guild.settings.findOrCreate({ where: { key: 'modLogChannel' }, defaults: { value: 'mod_logs' } });
  await guild.settings.findOrCreate({ where: { key: 'modRole' }, defaults: { value: 'Mods' } });
  await guild.settings.findOrCreate({ where: { key: 'adminRole' }, defaults: { value: 'Admins' } });
  await guild.settings.findOrCreate({ where: { key: 'welcomeEnabled' }, defaults: { value: 'true' } });
  await guild.settings.findOrCreate({ where: { key: 'welcomeChannel' }, defaults: { value: 'welcome' } });
  await guild.settings.findOrCreate({ where: { key: 'welcomeMessage' }, defaults: { value: 'Welcome to the server, {{user}}!' } });
  await guild.settings.findOrCreate({ where: { key: 'announcementChannel' }, defaults: { value: 'announcements' } });
  await guild.settings.findOrCreate({ where: { key: 'botCommanderRole' }, defaults: { value: 'Bot Commander' } });
  guildTable.sync();

  if (!guild.me.permissions.has('SEND_MESSAGES')) guild.owner.send(':x: **CRITICAL PERMISSION MISSING:** `Send Messages` **WHICH EVERYTHING REQUIRES!**');
  if (!guild.me.permissions.has('EMBED_LINKS')) guild.owner.send(':x: **CRITICAL PERMISSION MISSING:** `Embed Links` **WHICH EVERYTHING REQUIRES!**');

  var role = await guild.roles.find(role => role.name === 'Muted');
  if(role === null) {
    role = await guild.roles.find(role => role.name === 'muted');
    if(role === null) {
      role = await guild.createRole({name: 'Muted', color: 'ORANGE'});
    }
  }
  await guild.channels.filter(g => g.type === 'text').forEach(channel => {channel.overwritePermissions(role, {SEND_MESSAGES: false, ADD_REACTIONS: false});});
  await guild.channels.filter(g => g.type === 'voice').forEach(channel => {channel.overwritePermissions(role, {CONNECT: false, SPEAK: false});});

};
