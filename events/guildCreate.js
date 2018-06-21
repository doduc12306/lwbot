const Discord = require(`discord.js`);
const Sequelize = require(`sequelize`);

module.exports = (client, guild) => {

  // Thanks for this PSA, York. This guild is full of userbots spamming commands. If this bot enters it, you'll see extreme performance issues.
  if(guild.id === `439438441764356097`) return guild.leave();
 
  // We need to add this guild to our settings!
  client.settings.set(guild.id, client.config.defaultSettings);

  var modBase = new Sequelize(`database`, `user`, `password`, {
    host: `localhost`,
    dialect: `sqlite`,
    storage: `databases/${guild.id}.sqlite`
  });
  var modBase = modBase.define(`moderation`, { // eslint-disable-line no-redeclare
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

};
