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
    if (!amount) throw new Error('Missing amount parameter');
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
            if (+res[0].get('value') <= 0) return false;
            if (+res[0].get('value') - amount <= 0) return false;

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

  get mood() {
    return this.shortcut().findOrCreate({ where: { key: 'mood' }, defaults: { value: 'Great day to set your mood!' } })
      .then(res => {
        res = res[0].dataValues.value;
        return res;
      });
  }

  changeMood(newMood) {
    if (!newMood) throw new Error('Missing mood parameter');
    return this.shortcut().findOrCreate({ where: { key: 'mood' }, defaults: { value: 'Great day to set your mood!' } })
      .then(() => {
        this.shortcut().update({ value: newMood }, { where: { key: 'mood' } }).catch(e => { throw new Error(e); });
        return newMood;
      }).catch(e => { throw new Error(e); });
  }

  get badges() {
    return this.shortcut().findOrCreate({ where: { key: 'badges' }, defaults: { value: '' } })
      .then(res => {
        res = res[0].dataValues.value;
        return res;
      }).catch(e => { throw new Error(e); });
  }

  changeBadges(operation, badgeName) {
    switch (operation) {
      case 'add': {
        return this.shortcut().findOrCreate({ where: { key: 'badges' }, defaults: { value: '' } })
          .then(res => {
            const badgeArray = res[0].get('value').split(' ');
            if (badgeArray.includes(badgeName)) return false; // If the array has it already, dont go further.

            this.shortcut().update({ value: `${res[0].get('value')} ${badgeName}` }).catch(e => { throw new Error(e); });
            badgeArray.push(badgeName);
            return badgeArray;
          }).catch(e => { throw new Error(e); });
      }
      case 'remove': {
        return this.shortcut().findOrCreate({ where: { key: 'badges' }, defaults: { value: '' } })
          .then(res => {
            const badgeArray = res[0].get('value').split(' ');
            if (!badgeArray.includes(badgeName)) return false; // If the array does not have the badge, dont go further.

            const updated = badgeArray.splice(badgeArray.indexOf(badgeName), 1).join(' '); // Find the index of the badge, then remove (splice) it from that index
            this.shortcut().update({ value: updated }, { where: { key: 'badges' } }).catch(e => { throw new Error(e); });
            return updated;
          }).catch(e => { throw new Error(e); });
      }
      default: throw new Error('Operation must be one of "add" or "remove"');
    }
  }

  get reputation() {
    return this.shortcut().findOrCreate({ where: { key: 'reputation' }, defaults: { value: '0' } })
      .then(res => {
        res = res[0].dataValues.value;
        return +res;
      });
  }

  changeReputation(operation, amount) {
    if (!operation) throw new Error('Missing operation parameter');
    if (!amount) throw new Error('Missing amount parameter');
    switch (operation) {
      case 'add': {
        return this.shortcut().findOrCreate({ where: { key: 'reputation' }, defaults: { value: '0' } })
          .then(res => {
            return this.shortcut().update({ value: (+res[0].get('value') + amount).toString() }, { where: { key: 'reputation' } })
              .then(() => { return +res[0].get('value') + amount; })
              .catch(e => { throw new Error(e); });
          }).catch(e => { throw new Error(e); });
      }
      case 'subtract': {
        return this.shortcut().findOrCreate({ where: { key: 'reputation' }, defaults: { value: '0' } })
          .then(res => {
            if (+res[0].get('value') <= 0) return false;
            if (+res[0].get('value') - amount < 0) return false;

            return this.shortcut().update({ value: (+res[0].get('value') - amount).toString() }, { where: { key: 'reputation' } })
              .then(() => { return +res[0].get('value') - amount; })
              .catch(e => { throw new Error(e); });
          }).catch(e => { throw new Error(e); });
      }
      case 'set': {
        return this.shortcut().findOrCreate({ where: { key: 'reputation' }, defaults: { value: '0' } })
          .then(() => {
            return this.shortcut().update({ value: amount.toString() }, { where: { key: 'reputation' } }).then(() => {
              return amount;
            }).catch(e => { throw new Error(e); });
          }).catch(e => { throw new Error(e); });
      }
      default: throw new Error('Operation must be one of "add", "subtract", or "set".');
    }
  }

}

module.exports = User;