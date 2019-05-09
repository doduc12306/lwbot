
const Sequelize = require('sequelize');
const { Client } = require('discord.js'); // eslint-disable-line no-unused-vars

module.exports.table = (guildID) => {
  if(!guildID) throw new Error('guildID parameter is undefined');
  return new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: `databases/servers/${guildID}.sqlite`
  });
};

module.exports.xpSchema = (table) => {
  if(!table) throw new Error('table parameter is undefined');
  return table.define('userXP', {
    user: {
      type: Sequelize.STRING,
      allowNull: false
    },
    xp: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    level: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, { timestamps: false });
};

module.exports.functions = {

  xpSchema: (guildID) => this.xpSchema(this.table(guildID)),

  /**
   * @param {String} guildID The ID of the guild to use to access/create a database
   * @param {UserResolvable#ID} userID The ID of the user to add XP to
   * @param {Integer} amount The amount of XP to add
   */
  add: (guildID, userID, amount) => {
    return new Promise((resolve, reject) => {
      if (!userID) return reject(new Error('Missing userID to add xp'));
      if (!amount) return reject(new Error('Missing amount to add xp'));
      if (typeof userID !== 'string') return reject(new TypeError(`"${userID}" is not a string (must be an ID)`));
      if (typeof amount !== 'number') return reject(new TypeError(`"${amount}" is not a number`));
      if (amount < 0) return reject(new RangeError(`${amount} to add must be more than 0`));

      this.functions.xpSchema(guildID).findOrCreate({ where: { user: userID }, defaults: { xp: 0 } }).then(user => {
        user = user[0].dataValues;
        this.functions.xpSchema(guildID).update({ xp: user.xp + amount }, { where: { user: userID } });
        this.functions.xpSchema(guildID).sync();
        return resolve(user.xp);
      }).catch(e => { return reject(new Error(e)); });
    });
  },

  /**
   *
   * @param {UserResolvable#ID} userID The ID of the user to subtract XP from
   * @param {Integer} amount The amount of XP to subtract
   */
  subtract: (guildID, userID, amount) => {
    return new Promise((resolve, reject) => {
      if (!userID) return reject(new Error('Missing userID to subtract xp'));
      if (!amount) return reject(new Error('Missing amount to subtract xp'));
      if (typeof userID !== 'string') return reject(new TypeError(`"${userID}" is not a string (must be an ID)`));
      if (typeof amount !== 'number') return reject(new TypeError(`"${amount}" is not a number`));
      if (amount <= 0) return reject(new RangeError(`${amount} to subtract must be more than 0`));

      this.functions.xpSchema(guildID).findOrCreate({ where: { user: userID }, defaults: { xp: 0 } }).then(user => {
        user = user[0].dataValues;
        if (user.xp <= 0) return reject(new RangeError(`${userID}'s xp is 0. Cannot remove more`));
        this.functions.xpSchema(guildID).update({ xp: user.xp - amount }, { where: { user: userID } });
        this.functions.xpSchema(guildID).sync();
        return resolve(user.xp);
      }).catch(e => { return reject(new Error(e)); });
    });
  },

  /**
   *
   * @param {UserResolvable#ID} userID The ID of the user to set the XP to
   * @param {Integer} amount The amount of XP to set
   */
  set: (guildID, userID, amount) => {
    return new Promise((resolve, reject) => {
      if (!userID) return reject(new Error('Missing userID to set xp'));
      if (!amount) return reject(new Error('Missing amount to set xp'));
      if (typeof userID !== 'string') return reject(new TypeError(`"${userID}" is not a string (must be an ID)`));
      if (typeof amount !== 'number') return reject(new TypeError(`"${amount}" is not a number`));

      this.functions.xpSchema(guildID).findOrCreate({ where: { user: userID }, defaults: { xp: amount } }).then(user => {
        return resolve(user[0].dataValues.xp);
      }).catch(e => { return reject(new Error(e)); });
    });
  },

  /**
   *
   * @param {UserResolvable#ID} userID The ID of the user to get the XP of
   */
  get: async (guildID, userID) => {
    return new Promise((resolve, reject) => {
      if (!userID) return reject(new Error('Missing userID to get xp from'));
      if (typeof userID !== 'string') return reject(new TypeError(`"${userID}" is not a string (must be ID)`));

      this.functions.xpSchema(guildID).findOrCreate({ where: { user: userID }, defaults: { xp: 0 } }).then(async user => {
        return resolve(user[0].dataValues.xp);
      }).catch(e => { return reject(new Error(e)); });
    });
  }
};