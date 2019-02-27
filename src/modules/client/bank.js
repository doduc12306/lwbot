const Sequelize = require('sequelize');

module.exports = client => {
  const bank = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'databases/bank.sqlite'
  });

  client.bank = bank.define('bank', {
    user: {
      type: Sequelize.STRING,
      allowNull: false
    },
    balance: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });
  client.bank.sync();
  bank.sync();

  client.bank.add = (userID, amount) => {
    client.bank.findOne({ where: { user: userID } }).then(async user => {
      if (!user) {
        await client.bank.create({ user: userID, balance: 1000 });
        await client.bank.update({ balance: user.balance + amount }, { where: { user: userID } });
        client.bank.sync();
      }
      else {
        await client.bank.update({ balance: user.balance + amount }, { where: { user: userID } });
        client.bank.sync();
      }
    });
  };

  client.bank.subtract = (userID, amount) => {
    client.bank.findOne({ where: { user: userID } }).then(async user => {
      if (!user) {
        await client.bank.create({ user: userID, balance: 1000 });
        await client.bank.update({ balance: user.balance - amount }, { where: { user: userID } });
        client.bank.sync();
      }
      else {
        await client.bank.update({ balance: user.balance - amount }, { where: { user: userID } });
        client.bank.sync();
      }
    });
  };

  client.bank.set = (userID, amount) => {
    client.bank.findOne({ where: { user: userID } }).then(async user => {
      if (!user) {
        await client.bank.create({ user: userID, balance: 1000 });
        await client.bank.update({ balance: amount }, { where: { user: userID } });
        client.bank.sync();
      }
      else {
        await client.bank.update({ balance: amount }, { where: { user: userID } });
        client.bank.sync();
      }
    });
  };

  client.bank.get = async userID => {
    return new Promise((resolve) => {
      client.bank.findOne({ where: { user: userID } }).then(async user => {
        if (!user) {
          await client.bank.create({ user: userID, balance: 1000 });
        }
        resolve(user.balance);
      });
    });
  };
};