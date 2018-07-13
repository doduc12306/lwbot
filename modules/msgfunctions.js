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

  // Demographic portion!w eval 

  var demoTable = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'databases/wcDemographic.sqlite'
  });

  message.demo = demoTable.define('info', {
    time: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    messages: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {timestamps: false});
  demoTable.sync();

  message.demo.add = () => {
    var date = new Date();
    date = date.toString();
    date = date.substring(0, 21)
    message.demo.findOne({where: {time: date}}).then(async data => {
      if(data === null) {
        await message.demo.create({time: date, messages: 1});
        await message.demo.sync();
        await message.demo.update({messages: data.messages + 1}, {where: {time: date}});
      }
      else {
        await message.demo.update({messages: data.messages + 1}, {where: {time: date}});
        await message.demo.sync();
      }
    });
  }

  setInterval(() => {
    var date = new Date();
    date = date.toString();
    time = date.substring(22, 24);
    date = date.substring(0, 21)
    console.log(time);
    message.demo.findOne({where: {time: date}}).then(async data => {
      if(data === null && time === "59") {
        await message.demo.create({time: date, messages: 0});
        await message.demo.sync();
      }
    })
  }, 500);
};