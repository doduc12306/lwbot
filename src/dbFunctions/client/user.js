const Sequelize = require('sequelize');

class User {
  constructor (userID) {
    this.userID = userID;
  }

  table() {
    if (!this.userID) throw new Error('userID parameter is undefined');
    return new Sequelize('database', 'user', 'password', {
      host: 'localhost',
      dialect: 'sqlite',
      logging: false,
      storage: `databases/users/${this.userID}.sqlite`
    });
  }

  userSchema() {
    return this.table().define('profile', {
      key: { type: Sequelize.STRING, allowNull: false },
      value: { type: Sequelize.STRING, allowNull: false }
    }, { timestamps: false });
  }

  shortcut() {
    this.table().sync();
    this.userSchema().sync();

    return this.userSchema(this.table(this.userID));
  }

  get balance() {
    return this.shortcut().findOrCreate({ where: { key: 'balance' }, defaults: { value: '0' }})
      .then(res => {
        res = res[0].dataValues.value;
        return +res; // + = Number coersion
      });
  }

  get moto() {
    return this.shortcut().findOrCreate({ where: { key: 'moto' }, defaults: { value: 'Great day to set up the moto!' } })
      .then(res => {
        res = res[0].dataValues.value;
        return res;
      });
  }

  get badges() {
    return this.shortcut().findOrCreate({ where: { key: 'badges' }, defaults: { value: '' } })
      .then(res => {
        res = res[0].dataValues.value;
        return res;
      });
  }

  get reputation() {
    return this.shortcut().findOrCreate({ where: { key: 'reputation' }, defaults: { value: '0' } })
      .then(res => {
        res = res[0].dataValues.value;
        return +res; // + = Number coersion
      });
  }

  // TODO: Add set methods as well.
}

module.exports = User;