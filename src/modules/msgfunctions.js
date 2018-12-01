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
          client.settings.get(message.guild.id)[key] = value;
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
        delete client.settings.get(message.guild.id)[key];
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
        client.settings.get(message.guild.id)[key] = newValue;
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

  /* eslint-disable */
  // Other various functions
  message.functions = {
    parseRole: data => {
      if (message.channel.type !== 'text') throw new Error('I can\'t find a role if I\'m not in a guild!');
      if(!data) throw new Error('You didn\'t give me anything to find a role from!');
      if(message.mentions.roles.size === 0) {
        var role = message.guild.roles.get(data);
        if(role === undefined) {
          role = message.guild.roles.find(r => r.name.toLowerCase().includes(data.toLowerCase()));
          if(role === null) throw new Error('I couldn\'t find that role! ');
          else return role;
        } else return role;
      } else {
        role = message.mentions.roles.first();
        return role;
      }
    },
    parseUser: data => {
      if(!data) throw new Error('You didn\'t give me anything to find a user from!');
      if(message.mentions.users.size === 0) {
        var user = client.users.get(data);
        if(user === undefined) {
          user = client.users.find(r => (r.username.toLowerCase().includes(data.toLowerCase()) || r.tag.toLowerCase() === data.toLowerCase()));
          if(user === null) throw new Error('I couldn\'t find that user!');
          else return user;
        } else return user;
      } else {
        user = message.mentions.users.first();
        return user;
      }
    },
    parseMember: data => {
      if (message.channel.type !== 'text') throw new Error('I can\'t find a member if I\'m not in a guild!');
      if (!data) throw new Error('You didn\'t give me anything to find a member from!');
      if(message.mentions.members.size === 0) {
        var member = message.guild.members.get(data);
        if(member === undefined) {
          member = message.guild.members.find(r => (r.user.username.toLowerCase().includes(data.toLowerCase()) || r.user.tag.toLowerCase() === data.toLowerCase()));
          if (member === null) throw new Error('I couldn\'t find that member!');
          else return member;
        } else return member;
      } else {
        member = message.mentions.members.first();
        return member;
      }
    },
    parseChannel: data => {
      if (message.channel.type !== 'text') throw new Error('I can\'t find a channel if I\'m not in a guild!');
      if (!data) throw new Error('You didn\'t give me anything to find a channel from!');
      if(message.mentions.channels.size === 0) {
        var channel = message.guild.channels.get(data);
        if(channel === undefined) {
          data = data.split('#')[1];
          channel = message.guild.channels.find(r => r.name.toLowerCase().includes(data.toLowerCase()));
          if (channel === null) throw new Error('I couldn\'t find that channel!');
          else return channel;
        } else return channel;
      } else {
        channel = message.mentions.channels.first();
        return channel;
      }
    }
  };
};