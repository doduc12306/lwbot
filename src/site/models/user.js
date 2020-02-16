const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports.database = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: '../site/databases/users.sqlite',
});

module.exports.userModel = this.database.define('users', {
  userID: { type: DataTypes.STRING, allowNull: false, unique: true },
  username: { type: DataTypes.STRING, allowNull: false },
  discrim: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  refreshToken: { type: DataTypes.STRING, allowNull: false }
}, {
  timestamps: false,
});

this.userModel.sync()
  .then(() => this.database.sync())
  .then(() => console.log(`${__filename.split('/').reverse()[0]} model synced`));