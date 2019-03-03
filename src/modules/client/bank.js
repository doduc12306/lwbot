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
    return new Promise((resolve, reject) => {
      if (!userID) return reject(new Error('No userID given'));
      if (typeof userID !== 'string') return reject(new TypeError(`"${userID}" is not a string`));
      if (!client.users.get(userID)) return reject(new RangeError(`Could not find user "${userID}"`));
      if (!amount) return reject(new Error('No amount given'));
      if (typeof amount !== 'number') return reject(new TypeError(`"${amount}" is not a number`));

      client.bank.findOrCreate({ where: { user: userID }, defaults: { balance: 1000 } })
        .then(user => {
          user = user[0].dataValues;
          client.bank.update({ balance: user.balance + amount }, { where: { user: userID } }).then(uUser => { client.bank.sync(); return resolve(uUser[0].dataValues); }).catch(e => { return reject(new Error(e)); });
        });
    });
  };

  client.bank.subtract = (userID, amount) => {
    return new Promise((resolve, reject) => {
      if (!userID) return reject(new Error('No userID given'));
      if (typeof userID !== 'string') return reject(new TypeError(`"${userID}" is not a string`));
      if (!client.users.get(userID)) return reject(new RangeError(`Could not find user "${userID}"`));
      if (!amount) return reject(new Error('No amount given'));
      if (typeof amount !== 'number') return reject(new TypeError(`"${amount}" is not a number`));

      client.bank.findOrCreate({ where: { user: userID }, defaults: { balance: 1000 } })
        .then(user => {
          user = user[0].dataValues;
          client.bank.update({ balance: user.balance - amount }, { where: { user: userID } }).then(uUser => { client.bank.sync(); return resolve(uUser[0].dataValues); }).catch(e => { return reject(new Error(e)); });
        })
        .catch(e => { return reject(new Error(e)); });
    });
  };

  client.bank.set = (userID, amount) => {
    return new Promise((resolve, reject) => {
      if (!userID) return reject(new Error('No userID given'));
      if (typeof userID !== 'string') return reject(new TypeError(`"${userID}" is not a string`));
      if (!client.users.get(userID)) return reject(new RangeError(`Could not find user "${userID}"`));
      if (!amount) return reject(new Error('No amount given'));
      if (typeof amount !== 'number') return reject(new TypeError(`"${amount}" is not a number`));

      client.bank.findOrCreate({ where: { user: userID }, defaults: { balance: 1000 } })
        .then(() => {
          client.bank.update({ balance: amount }, { where: { user: userID } }).then(uUser => { client.bank.sync(); return resolve(uUser[0].dataValues); }).catch(e => { return reject(new Error(e)); });
        })
        .catch(e => { return reject(new Error(e)); });
    });
  };

  client.bank.get = async userID => {
    return new Promise((resolve, reject) => {
      if (!userID) return reject(new Error('No userID given'));
      if (typeof userID !== 'string') return reject(new TypeError(`"${userID}" is not a string`));
      if (!client.users.get(userID)) return reject(new RangeError(`Could not find user "${userID}"`));

      client.bank.findOrCreate({ where: { user: userID }, defaults: { balance: 1000 } })
        .then(async user => {
          client.bank.sync();
          return resolve(user[0].dataValues);
        })
        .catch(e => { return reject(new Error(e)); });
    });
  };
};