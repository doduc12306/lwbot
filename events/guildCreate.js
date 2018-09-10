const Sequelize = require('sequelize');

module.exports = async (client, guild) => {

  // Thanks for this PSA, York. This guild is full of userbots spamming commands. If this bot enters it, you'll see extreme performance issues.
  if(guild.id === '439438441764356097') return guild.leave();

  // We need to add this guild to our settings!
  if(!client.settings.get(guild.id)) client.settings.set(guild.id, client.config.defaultSettings);

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

  guild.settings.create({key: 'prefix', value: '!w '});
  guild.settings.create({key: 'modLogChannel', value: 'mod_logs'});
  guild.settings.create({key: 'modRole', value: 'Mods'});
  guild.settings.create({key: 'adminRole', value: 'Admins'});
  guild.settings.create({key: 'systemNotice', value: 'true'});
  guild.settings.create({key: 'welcomeEnabled', value: 'false'});
  guild.settings.create({key: 'welcomeChannel', value: 'welcome'});
  guild.settings.create({key: 'welcomeMessage', value: 'Welcome to the server, {{user}}!'});
  guild.settings.create({key: 'announcementChannel', value: 'announcements'});
  guild.settings.create({key: 'botCommanderRole', value: 'Bot Commander'});
  guildTable.sync();

  if(!guild.me.permissions.has('SEND_MESSAGES')) guild.owner.send(':x: **CRITICAL PERMISSION MISSING:** Send Messages **WHICH EVERYTHING REQUIRES!**');

  var role;
  if(!guild.roles.find('name', 'Muted')) {
    role = guild.createRole({name: 'Muted'});
    guild.channels.filter(g => g.type === 'text').forEach(channel => {channel.overwritePermissions(role, {SEND_MESSAGES: false, ADD_REACTIONS: false});});
    guild.channels.filter(g => g.type === 'voice').forEach(channel => {channel.overwritePermissions(role, {CONNECT: false, SPEAK: false});});
  } else {
    role = guild.roles.find('name', 'Muted') || guild.roles.find('name', 'muted');
    guild.channels.filter(g => g.type === 'text').forEach(channel => {channel.overwritePermissions(role, {SEND_MESSAGES: false});});
    guild.channels.filter(g => g.type === 'voice').forEach(channel => {channel.overwritePermissions(role, {CONNECT: false, SPEAK: false});});
  }

};
