const Discord = require(`discord.js`);
const Sequelize = require(`sequelize`);

module.exports = (client, guild) => {

  // Thanks for this PSA, York. This guild is full of userbots spamming commands. If this bot enters it, you'll see extreme performance issues.
  if(guild.id === `439438441764356097`) return guild.leave();
 
  // We need to add this guild to our settings!
  if(!client.settings.get(guild.id)) client.settings.set(guild.id, client.config.defaultSettings);

  var modBase = new Sequelize(`database`, `user`, `password`, {
    host: `localhost`,
    dialect: `sqlite`,
    storage: `databases/servers/${guild.id}.sqlite`
  });
  modBase = modBase.define(`moderation`, {
    victim: {
      type: Sequelize.STRING,
      allowNull: false
    },
    moderator: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    reason: Sequelize.STRING,
    duration: Sequelize.STRING
  });
  modBase.sync();

  var role;
  if(!guild.roles.find(`name`, `Muted`)) {
    role = guild.createRole({name: `Muted`});
    guild.channels.filter(g => g.type === `text`).forEach(channel => {channel.overwritePermissions(role, {SEND_MESSAGES: false, ADD_REACTIONS: false});});
    guild.channels.filter(g => g.type === `voice`).forEach(channel => {channel.overwritePermissions(role, {CONNECT: false, SPEAK: false});});
  } else {
    role = guild.roles.find(`name`, `Muted`) || guild.roles.find(`name`, `muted`);
    guild.channels.filter(g => g.type === `text`).forEach(channel => {channel.overwritePermissions(role, {SEND_MESSAGES: false});});
    guild.channels.filter(g => g.type === `voice`).forEach(channel => {channel.overwritePermissions(role, {CONNECT: false, SPEAK: false});});
  }

};
