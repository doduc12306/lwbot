const Sequelize = require('sequelize');
module.exports = (client, message) => {
  const guildTable = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: `databases/servers/${message.guild.id}.sqlite`
  });

  message.guild.commands = guildTable.define('commands', {
    command: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    folder: {
      type: Sequelize.STRING,
      allowNull: false
    },
    enabled: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    permLevel: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, { timestamps: false });
};