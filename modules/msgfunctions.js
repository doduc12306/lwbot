const Sequelize = require('sequelize');

module.exports = async (message) => {
  var xpTable = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: `databases/servers/${message.guild.id}.sqlite`
  });

  message.guild.xp = xpTable.define('userXP', {
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

  message.guild.xp.get = async userID => {
    return new Promise((resolve, reject) => {
      message.guild.xp.findOne({where: {user: userID}}).then(async user => {
        if(user === null) {
          await message.guild.xp.create({user: userID, xp: 0});
        }
        resolve(user.xp);
      });
    });
  };
};