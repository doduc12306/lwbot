const Sequelize = require('sequelize');

module.exports = async (message) => {

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
    message.guild.xp.findOne({where: {user: userID}}).then(async user => {
      if(user === null) {
        await message.guild.xp.create({user: userID, xp: 0});
        await message.guild.xp.sync();
        await message.guild.xp.update({xp: user.xp + amount}, {where: {user: userID}});
        await message.guild.xp.sync();
      }
      else {
        await message.guild.xp.update({xp: user.xp + amount}, {where: {user: userID}});
        await message.guild.xp.sync();
      }
    });
  }

  /**
   *
   * @param {UserResolvable#ID} userID The ID of the user to subtract XP from
   * @param {Integer} amount The amount of XP to subtract
   */
  message.guild.xp.subtract = (userID, amount) => {
    message.guild.xp.findOne({where: {user: userID}}).then(async user => {
      if(user === null) {
        await message.guild.xp.create({user: userID, xp: 0});
        await message.guild.xp.update({xp: user.xp - amount}, {where: {user: userID}});
        message.guild.xp.sync();
      }
      else {
        await message.guild.xp.update({xp: user.xp - amount}, {where: {user: userID}});
        message.guild.xp.sync();
      }
    });
  }

  /**
   *
   * @param {UserResolvable#ID} userID The ID of the user to set the XP to
   * @param {Integer} amount The amount of XP to set
   */
  message.guild.xp.set = (userID, amount) => {
    message.guild.xp.findOne({where: {user: userID}}).then(async user => {
      if(user === null) {
        await message.guild.xp.create({user: userID, xp: 0});
        await message.guild.xp.update({xp: amount}, {where: {user: userID}});
        message.guild.xp.sync();
      }
      else {
        await message.guild.xp.update({xp: amount}, {where: {user: userID}});
        message.guild.xp.sync();
      }
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
  });
  guildTable.sync();


};