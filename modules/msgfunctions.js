const Sequelize = require('sequelize');

module.exports = async (message) => {
  var xpTable = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: `databases/servers/${message.guild.id}.sqlite`
  });

  message.xp = xpTable.define('userXP', {
    user: {
      type: Sequelize.STRING,
      allowNull: false
    },
    xp: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });
  message.xp.sync();

  message.xp.add = (userID, amount) => {
    message.xp.findOne({where: {user: userID}}).then(async user => {
      if(user === null) {
        await message.xp.create({user: userID, xp: 0});
        await message.xp.sync();
        message.xp.update({xp: user.xp + amount}, {where: {user: userID}});
      }
      else {
        await message.xp.update({xp: user.xp + amount}, {where: {user: userID}});
        message.xp.sync();
      }
    });
  }

  message.xp.subtract = (userID, amount) => {
    message.xp.findOne({where: {user: userID}}).then(async user => {
      if(user === null) {
        await message.xp.create({user: userID, xp: 0});
        await message.xp.update({xp: user.xp - amount}, {where: {user: userID}});
        message.xp.sync();
      }
      else {
        await message.xp.update({xp: user.xp - amount}, {where: {user: userID}});
        message.xp.sync();
      }
    });
  }

  message.xp.set = (userID, amount) => {
    message.xp.findOne({where: {user: userID}}).then(async user => {
      if(user === null) {
        await message.xp.create({user: userID, xp: 0});
        await message.xp.update({xp: amount}, {where: {user: userID}});
        message.xp.sync();
      }
      else {
        await message.xp.update({xp: amount}, {where: {user: userID}});
        message.xp.sync();
      }
    });
  }

  message.xp.get = async userID => {
    return new Promise((resolve, reject) => {
      message.xp.findOne({where: {user: userID}}).then(async user => {
        if(user === null) {
          await message.xp.create({user: userID, xp: 0});
        }
        resolve(user.xp);
      });
    });
  };
};