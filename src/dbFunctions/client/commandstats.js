const Sequelize = require('sequelize');

module.exports.commandStatsDb = new Sequelize('database', 'username', 'password', {
  logging: false,
  storage: 'databases/commandStatsDb.sqlite',
  dialect: 'sqlite',
  host: 'localhost',
  transactionType: 'IMMEDIATE'
});

module.exports.statsTable = this.commandStatsDb.define('commandStats', {
  command: { type: Sequelize.STRING, allowNull: false, unique: true },
  timesUsed: { type: Sequelize.NUMBER, allowNull: false, defaultValue: 0 }
});

module.exports.optOutUsers = this.commandStatsDb.define('optOutUsers', {
  userID: { type: Sequelize.STRING, allowNull: false, unique: true }
});

const Logger = require('../../util/Logger');
this.commandStatsDb.sync()
  .then(() => Logger.verbose('Command stats database synced'))
  .catch(e => {
    Logger.verbose(`From ${__filename}`);
    Logger.error(e);
  });