const Sequelize = require('sequelize');

module.exports = async (client, message) => {

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
      allowNull: false,
      defaultValue: 0
    },
    level: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {timestamps: false});
  message.guild.xp.sync();
  guildTable.sync();

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
      if(message.guild.members.get(userID) === undefined) return reject(new Error(`Could not find member "${userID}" to add xp to`));
      if(typeof amount !== 'number') return reject(new TypeError(`"${amount}" is not a number`));
      if(amount < 0) return reject(new RangeError(`${amount} to add must be more than 0`));

      message.guild.xp.findOrCreate({where: {user: userID}, defaults: {xp: 0}}).then(user => {
        user = user[0].dataValues;
        message.guild.xp.update({xp: user.xp + amount}, {where: {user: userID}});
        message.guild.xp.sync();
        return resolve(user.xp);
      }).catch(e => {return reject(new Error(e));});
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
        if(user.xp <= 0) return reject(new RangeError(`${userID}'s xp is 0. Cannot remove more`));
        message.guild.xp.update({ xp: user.xp - amount }, {where: {user: userID}});
        message.guild.xp.sync();
        return resolve(user.xp);
      }).catch(e => {return reject(new Error(e));});
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
      }).catch(e => {return reject(new Error(e));});
    });
  };

  /**
   *
   * @param {UserResolvable#ID} userID The ID of the user to get the XP of
   */
  message.guild.xp.get = async userID => {
    return new Promise((resolve, reject) => {
      if(!userID) return reject(new Error('Missing userID to get xp from'));
      if(typeof userID !== 'string') return reject(new TypeError(`"${userID}" is not a string (must be ID)`));
      if (message.guild.members.get(userID) === undefined) return reject(new Error(`Could not find member "${userID}" to get xp`));

      message.guild.xp.findOrCreate({ where: { user: userID }, defaults: { xp: 0 } }).then(async user => {
        return resolve(user[0].dataValues.xp);
      }).catch(e => {return reject(new Error(e));});
    });
  };

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
  };

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
  };
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
  };
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
  };

  // XP Leveling sequence

  // Other various functions
  message.functions = {
    parseChannel: (data, outputType) => {
      var channelObj;
      var parsedChannel;
      return new Promise((resolve, reject) => {
        if(!message.guild) return reject(new Error('Not in a guild!'));
        if(!data || data === null) return reject(new TypeError('No data given to parse channel information'));

        if(typeof data === 'string') {
          parsedChannel = message.guild.channels.get(data);
          if (parsedChannel === undefined || parsedChannel === null) {
            parsedChannel = message.guild.channels.find(channel => channel.name === data);
            if (parsedChannel === undefined || parsedChannel === null) return reject(new Error('Channel not found'));
            else channelObj = parsedChannel;
          } else channelObj = parsedChannel;
        }

        else if (typeof data === 'object') {
          parsedChannel = message.guild.channels.get(data.id);
          if (parsedChannel === undefined || parsedChannel === null) return reject(new Error('[Object Parse] Channel not found'));
          else channelObj = parsedChannel;
        }
        else {return reject(new Error(`Data ("${data}") could not be parsed into a channel. Must be either string or object.`));}

        if (!outputType || outputType === null) return resolve(channelObj);
        else if(outputType.toLowerCase() === 'id') return resolve(channelObj.id);
        else if(outputType.toLowerCase() === 'name') return resolve(channelObj.name);
        else return reject(new TypeError('Unknown output type; must be "id" or "name"'));
      });
    },
    parseUser: (data, outputType) => {
      var userObj;
      var parsedUser;
      return new Promise((resolve, reject) => {
        if (!message.guild) return reject(new Error('Not in a guild!'));
        if (!data || data === null) return reject(new TypeError('No data given to parse user information'));

        if (typeof data === 'string') {
          parsedUser = message.client.users.get(data);
          if (parsedUser === undefined || parsedUser === null) {
            parsedUser = message.client.users.find(user => user.username === data);
            if (parsedUser === undefined || parsedUser === null) return reject(new Error('User not found'));
            else userObj = parsedUser;
          } else userObj = parsedUser;
        }

        else if (typeof data === 'object') {
          parsedUser = message.client.users.get(data.id);
          if (parsedUser === undefined || parsedUser === null) return reject(new Error('[Object Parse] User not found'));
          else userObj = parsedUser;
        }
        else { return reject(new Error(`Data ("${data}") could not be parsed into a user. Must be either string or object.`)); }

        if (!outputType || outputType === null) return resolve(userObj);
        else if (outputType.toLowerCase() === 'id') return resolve(userObj.id);
        else if (outputType.toLowerCase() === 'username') return resolve(userObj.username);
        else return reject(new TypeError('Unknown output type; must be "id" or "name"'));
      });
    },
    parseGuild: (data, outputType) => {
      var parsedGuild;
      var guildObj;
      return new Promise((resolve, reject) => {
        if (!data || data === null) return reject(new TypeError('No data given to parse guild information'));
        if (typeof data !== 'string') return reject(new TypeError('Data must be a string'));

        parsedGuild = message.client.guilds.get(data);
        if (parsedGuild === undefined) {
          parsedGuild = message.client.guilds.find(g => g.name === data);
          if (parsedGuild === undefined) return reject(new Error('Guild not found'));
          else guildObj = parsedGuild;
        } else guildObj = parsedGuild;

        if (!outputType || outputType === null) return resolve(guildObj);
        else if (outputType.toLowerCase() === 'id') return resolve(guildObj.id);
        else if (outputType.toLowerCase() === 'name') return resolve(guildObj.name);
        else return reject(new TypeError('Unknown output type; must be "id" or "name"'));
      });
    }
  };
};