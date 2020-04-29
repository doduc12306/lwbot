const Sequelize = require('sequelize');

module.exports.tagBase = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'databases/tags.sqlite',
  transactionType: 'IMMEDIATE' // Setting this helps with the "SQLITE_BUSY: Database is locked" errors
});

module.exports.tagsTable = this.tagBase.define('tags', {
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  description: Sequelize.TEXT,
  username: Sequelize.STRING,
  usage_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  }
});