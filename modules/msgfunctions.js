const Sequelize = require('sequelize');

module.exports = async (message) => {

  if(message.channel.type === 'dm') return;
  // FROM HERE IS GUILD SUPPORT. PUT ALL THINGS THAT DONT REQUIRE A GUILD ABOVE THIS

  // XP support
  var guildTable = new Sequelize('database', 'user', 'password', {
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
      allowNull: false
    }
  });
  message.guild.xp.sync();

  /**
   *
   * @param {UserResolvable#ID} userID The ID of the user to add XP to
   * @param {Integer} amount The amount of XP to add
   */
  message.guild.xp.add = (userID, amount) => {
    return new Promise((resolve, reject) => {
      if(!userID) return reject(new Error('Missing userID to add xp'));
      if(!amount) return reject(new Error('Missing amount to add xp'));
      if(typeof userID !== 'string') return reject(new TypeError(`"${userID}" is not a string (must be an ID)`));
      if(message.guild.members.get(userID) === undefined) return reject(new Error(`Could not find user "${userID}" to add xp to`));
      if(typeof amount !== 'number') return reject(new TypeError(`"${amount}" is not a number`));

      message.guild.xp.findOne({where: {user: userID}}).then(async user => {
        if(user === null) {await message.guild.xp.create({user: userID, xp: 0}); await message.guild.xp.sync();}
        await message.guild.xp.update({xp: user.xp + amount}, {where: {user: userID}});
        await message.guild.xp.sync();
        return resolve(true);
      });
    });
  }

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
      if (message.guild.members.get(userID) === undefined) return reject(new Error(`Could not find user "${userID}" to subtract xp from`));
      if (typeof amount !== 'number') return reject(new TypeError(`"${amount}" is not a number`));

      message.guild.xp.findOne({ where: { user: userID } }).then(async user => {
        if (user === null) { await message.guild.xp.create({ user: userID, xp: 0 }); message.guild.xp.sync(); }
        await message.guild.xp.update({ xp: user.xp - amount }, { where: { user: userID } });
        await message.guild.xp.sync();
        return resolve(true);
      });
    });
  }

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
      if (message.guild.members.get(userID) === undefined) return reject(new Error(`Could not find user "${userID}" to set xp to`));
      if (typeof amount !== 'number') return reject(new TypeError(`"${amount}" is not a number`));

      message.guild.xp.findOne({ where: { user: userID } }).then(async user => {
        if (user === null) { await message.guild.xp.create({ user: userID, xp: 0 }); message.guild.xp.sync(); }
        await message.guild.xp.update({ xp: amount }, { where: { user: userID } });
        await message.guild.xp.sync();
        return resolve(true);
      });
    });
  }

  /**
   *
   * @param {UserResolvable#ID} userID The ID of the user to get the XP of
   */
  message.guild.xp.get = async userID => {
    return new Promise((resolve, reject) => {
      message.guild.xp.findOne({where: {user: userID}}).then(async user => {
        if(user === null) {
          await message.guild.xp.create({user: userID, xp: 0});
        }
        return resolve(user.xp);
      });
    });
  };

  // Guild modbase support
  message.guild.modbase = guildTable.define(`moderation`, {
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

  // Guild settings support
  message.guild.settings = guildTable.define('settings', {
   key: {
     type: Sequelize.STRING,
     allowNull: false
   },
   value: Sequelize.STRING
  }, {timestamps: false});
  guildTable.sync();

  /**
   *
   * @param {String} key The name of the setting to add
   * @param {String} value The value of the setting
   */
  message.guild.settings.add = (key, value) => {
    return new Promise((resolve, reject) => {
      if(!key) return reject(new Error('Missing key to add'));
      if(!value) return reject(new Error('Missing value to add'));
      if(typeof key !== 'string') return reject(new TypeError(`"${key}" is not a string`));
      if(typeof value !== 'string') return reject(new TypeError(`"${value}" is not a string`));
      if(key.includes(' ')) return reject(new Error(`"${key}" must be one word`));

      message.guild.settings.create({key: key, value: value})
        .then(() => {
          return resolve(true);
        })
        .catch(e => {
          return reject(new Error(e));
        });
    });
  }

  /**
   *
   * @param {String} key The name of the setting to delete
   */
  message.guild.settings.delete = key => {
    return new Promise((resolve, reject) => {
      if(!key) return reject(new Error('Missing key to delete'));
      if(typeof key !== 'string') return reject(new TypeError(`"${key}" is not a string`));
      message.guild.settings.findOne({where: {key: key}}).then(data => {
        if(data === null) return reject(new Error(`The key "${key}" does not exist to delete`));
        message.guild.settings.destroy({where: {key: key}});
        return resolve(true);
      });
    });
  }
  message.guild.settings.remove = key => message.guild.settings.delete(key);

  /**
   *
   * @param {String} key The name of the setting to edit
   * @param {String} newValue The new value of the setting
   */
  message.guild.settings.edit = (key, newValue) => {
    return new Promise((resolve, reject) => {
      if(!key) return reject(new Error('Missing key to edit'));
      if(!newValue) return reject(new Error('Missing value to edit'));
      if(typeof key !== 'string') return reject(new TypeError(`"${key}" is not a string`));
      if(typeof newValue !== 'string') return reject(new TypeError(`"${newValue}" is not a string`));

      message.guild.settings.findOne({where: {key: key}}).then(data => {
        if(data === null) return reject(new Error(`The key "${key}" does not exist to edit`));
        message.guild.settings.update({value: newValue}, {where: {key: key}});
        return resolve(true);
      });
    });
  }
  message.guild.settings.set = (key, newValue) => message.guild.settings.edit(key, newValue);

  /**
   *
   * @param {String} key The name of the key to get
   */
  message.guild.settings.get = key => {
    return new Promise((resolve, reject) => {
      if(!key) return reject(new Error('Missing key to get'));
      if(typeof key !== 'string') return reject(new TypeError(`"${key}" is not a string`));

      message.guild.settings.findOne({where: {key: key}}).then(data => {
        if(data === null) return reject(new Error(`"${key}" does not exist to get`));
        return resolve(data.value);
      });
    });
  }

};