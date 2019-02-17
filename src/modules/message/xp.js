const Sequelize = require('sequelize');

module.exports = (client, message) => {
  if (message.channel.type === 'dm') return;

  // XP support
  const guildTable = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: `databases/servers/${message.guild.id}.sqlite`
  });

  message.guild.xp = guildTable.define('userXP', {
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
  message.guild.xp.sync();
  guildTable.sync();

  /**
   *
   * @param {UserResolvable#ID} userID The ID of the user to add XP to
   * @param {Integer} amount The amount of XP to add
   */
  message.guild.xp.add = (userID, amount) => {
    return new Promise((resolve, reject) => {
      if (!userID) return reject(new Error('Missing userID to add xp'));
      if (!amount) return reject(new Error('Missing amount to add xp'));
      if (typeof userID !== 'string') return reject(new TypeError(`"${userID}" is not a string (must be an ID)`));
      if (message.guild.members.get(userID) === undefined) return reject(new Error(`Could not find member "${userID}" to add xp to`));
      if (typeof amount !== 'number') return reject(new TypeError(`"${amount}" is not a number`));
      if (amount < 0) return reject(new RangeError(`${amount} to add must be more than 0`));

      message.guild.xp.findOrCreate({ where: { user: userID }, defaults: { xp: 0 } }).then(user => {
        user = user[0].dataValues;
        message.guild.xp.update({ xp: user.xp + amount }, { where: { user: userID } });
        message.guild.xp.sync();
        return resolve(user.xp);
      }).catch(e => { return reject(new Error(e)); });
    });
  };

  /**
   *
   * @param {UserResolvable#ID} userID The ID of the user to subtract XP from
   * @param {Integer} amount The amount of XP to subtract
   */
  message.guild.xp.subtract = (userID, amount) => {
    return new Promise((resolve, reject) => {
      if (!userID) return reject(new Error('Missing userID to subtract xp'));
      if (!amount) return reject(new Error('Missing amount to subtract xp'));
      if (typeof userID !== 'string') return reject(new TypeError(`"${userID}" is not a string (must be an ID)`));
      if (message.guild.members.get(userID) === undefined) return reject(new Error(`Could not find member "${userID}" to subtract xp from`));
      if (typeof amount !== 'number') return reject(new TypeError(`"${amount}" is not a number`));
      if (amount <= 0) return reject(new RangeError(`${amount} to subtract must be more than 0`));

      message.guild.xp.findOrCreate({ where: { user: userID }, defaults: { xp: 0 } }).then(user => {
        user = user[0].dataValues;
        if (user.xp <= 0) return reject(new RangeError(`${userID}'s xp is 0. Cannot remove more`));
        message.guild.xp.update({ xp: user.xp - amount }, { where: { user: userID } });
        message.guild.xp.sync();
        return resolve(user.xp);
      }).catch(e => { return reject(new Error(e)); });
    });
  };

  /**
   *
   * @param {UserResolvable#ID} userID The ID of the user to set the XP to
   * @param {Integer} amount The amount of XP to set
   */
  message.guild.xp.set = (userID, amount) => {
    return new Promise((resolve, reject) => {
      if (!userID) return reject(new Error('Missing userID to set xp'));
      if (!amount) return reject(new Error('Missing amount to set xp'));
      if (typeof userID !== 'string') return reject(new TypeError(`"${userID}" is not a string (must be an ID)`));
      if (message.guild.members.get(userID) === undefined) return reject(new Error(`Could not find member "${userID}" to set xp to`));
      if (typeof amount !== 'number') return reject(new TypeError(`"${amount}" is not a number`));

      message.guild.xp.findOrCreate({ where: { user: userID }, defaults: { xp: amount } }).then(user => {
        return resolve(user[0].dataValues.xp);
      }).catch(e => { return reject(new Error(e)); });
    });
  };

  /**
   *
   * @param {UserResolvable#ID} userID The ID of the user to get the XP of
   */
  message.guild.xp.get = async userID => {
    return new Promise((resolve, reject) => {
      if (!userID) return reject(new Error('Missing userID to get xp from'));
      if (typeof userID !== 'string') return reject(new TypeError(`"${userID}" is not a string (must be ID)`));
      if (message.guild.members.get(userID) === undefined) return reject(new Error(`Could not find member "${userID}" to get xp`));

      message.guild.xp.findOrCreate({ where: { user: userID }, defaults: { xp: 0 } }).then(async user => {
        return resolve(user[0].dataValues.xp);
      }).catch(e => { return reject(new Error(e)); });
    });
  };


  // XP Leveling sequence here

  // End XP Leveling sequence
};