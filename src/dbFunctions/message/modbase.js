const Sequelize = require('sequelize');

module.exports = (client, message) => {
  if(message.channel.type === 'dm') return;

  const guildTable = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: `databases/servers/${message.guild.id}.sqlite`
  });

  // Guild modbase support
  message.guild.modbase = guildTable.define('moderation', {
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
  message.guild.modbase.sync();

};