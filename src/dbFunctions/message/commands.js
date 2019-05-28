const Sequelize = require('sequelize');

module.exports.table = (guildID) => {
  if(!guildID) throw new Error('guildID parameter is undefined');
  return new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: `databases/servers/${guildID}.sqlite`,
    operatorsAliases: false
  });
};

module.exports.commandsSchema = (table) => {
  if(!table) throw new Error('table parameter is undefined');
  return table.define('commands', {
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

module.exports.functions = {

  commandsSchema: (guildID) => this.commandsSchema(this.table(guildID))

};

