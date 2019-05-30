const Sequelize = require('sequelize');

class User {
  constructor(userID) {
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
    return this.shortcut().findOrCreate({ where: { key: 'balance' }, defaults: { value: '0' } })
      .then(res => {
        return +res[0].get('value');
      });
  }

  changeBalance(operation, amount) {
    if (!operation) throw new Error(`Missing operation to perform on ${this.userID}`);
    if (!amount) throw new Error(`Missing amount to ${operation}`);
    switch (operation) {
      case 'add': {
        return this.shortcut().findOrCreate({ where: { key: 'balance' }, defaults: { value: '0' } })
          .then(res => {
            return this.shortcut().update({ value: (+res[0].get('value') + amount).toString() }, { where: { key: 'balance' } }).then(() => {
              return +res[0].get('value') + amount;
            }).catch(e => { throw new Error(e); });
          }).catch(e => { throw new Error(e); });
      }
      case 'subtract': {
        return this.shortcut().findOrCreate({ where: { key: 'balance' }, defaults: { value: '0' } })
          .then(res => {
            return this.shortcut().update({ value: (+res[0].get('value') - amount).toString() }, { where: { key: 'balance' } }).then(() => {
              return +res[0].get('value') - amount;
            }).catch(e => { throw new Error(e); });
          }).catch(e => { throw new Error(e); });
      }
      case 'set': {
        return this.shortcut().findOrCreate({ where: { key: 'balance' }, defaults: { value: '0' } })
          .then(() => {
            return this.shortcut().update({ value: amount.toString() }, { where: { key: 'balance' } }).then(() => {
              return amount;
            }).catch(e => { throw new Error(e); });
          }).catch(e => { throw new Error(e); });
      }
      default: throw new Error('Operation must be one of "add", "subtract", or "set".');
    }
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