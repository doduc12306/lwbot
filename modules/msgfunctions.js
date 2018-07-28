const Sequelize = require('sequelize');

module.exports = async (message) => {
  // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
  process.on(`uncaughtException`, (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, `g`), `./`);
    client.logger.error(`Uncaught Exception: ${errorMsg}`);
    process.exit(1);
  });

  process.on(`unhandledRejection`, err => {
    client.logger.error(`Unhandled rejection: ${err.stack}`);
  });
  
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