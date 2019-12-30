const Sequelize = require('sequelize');
const { client } = require('../../startup'); // Client bot got initialized with
const { User } = require('discord.js');

/**
 * Hub for interacting with user profile database
 */
class UserProfile {
  /**
   * @param {String} userID User ID of the user to create/modify
   */
  constructor(userID) {
    if (userID instanceof User) userID = userID.id; // If the userID passed is actually a d.js user object, then turn it into an id that the class can handle.

    const user = client.users.get(userID);
    if (!user) throw new Error('User does not exist to get.');

    this.userID = userID;
    this.djsUser = user;
  }

  /**
   * The table of the profile
   */
  table() {
    return new Sequelize('database', 'user', 'password', {
      host: 'localhost',
      dialect: 'sqlite',
      logging: false,
      storage: `databases/users/${this.userID}.sqlite`,
      transactionType: 'IMMEDIATE' // Setting this helps with the "SQLITE_BUSY: Database is locked" errors
    });
  }

  /**
   * The schema used to poll the database table
   */
  userSchema() {
    return this.table().define('profile', {
      key: { type: Sequelize.STRING, allowNull: false },
      value: { type: Sequelize.STRING, allowNull: false }
    }, { timestamps: false });
  }

  /**
   * Simple shortcut to the table using the user ID provided earlier
   */
  get shortcut() {
    this.table().sync();
    this.userSchema().sync();

    return this.userSchema(this.table(this.userID));
  }

  /**
   * Balance of the user
   * @return {Number}
   * @readonly
   */
  get balance() {
    return this.shortcut.findOrCreate({ where: { key: 'balance' }, defaults: { value: '0' } })
      .then(res => {
        return +res[0].get('value');
      });
  }

  /**
   * Changes the balance of the user
   * @param {'add' | 'subtract' | 'set'} operation Operation to perform on balance of user
   * @param {Number} amount Amount to add/subtract/set
   * @return {Number}
   * @example
   * <User>.changeBalance('add', 10); // 0 => 10
   */
  changeBalance(operation, amount) {
    if (!amount) throw new Error('Missing amount parameter');
    switch (operation) {
      case 'add': {
        return this.shortcut.findOrCreate({ where: { key: 'balance' }, defaults: { value: '0' } })
          .then(res => {
            return this.shortcut.update({ value: (+res[0].get('value') + amount).toString() }, { where: { key: 'balance' } }).then(() => {
              return +res[0].get('value') + amount;
            }).catch(e => { throw new Error(e); });
          }).catch(e => { throw new Error(e); });
      }
      case 'subtract': {
        return this.shortcut.findOrCreate({ where: { key: 'balance' }, defaults: { value: '0' } })
          .then(res => {
            if (+res[0].get('value') <= 0) return false;
            if (+res[0].get('value') - amount <= 0) return false;

            return this.shortcut.update({ value: (+res[0].get('value') - amount).toString() }, { where: { key: 'balance' } }).then(() => {
              return +res[0].get('value') - amount;
            }).catch(e => { throw new Error(e); });
          }).catch(e => { throw new Error(e); });
      }
      case 'set': {
        return this.shortcut.findOrCreate({ where: { key: 'balance' }, defaults: { value: '0' } })
          .then(() => {
            return this.shortcut.update({ value: amount.toString() }, { where: { key: 'balance' } }).then(() => {
              return amount;
            }).catch(e => { throw new Error(e); });
          }).catch(e => { throw new Error(e); });
      }
      default: throw new Error('Operation must be one of "add", "subtract", or "set".');
    }
  }

  /**
   * Gets the mood of the user
   * @return {String}
   * @readonly
   */
  get mood() {
    return this.shortcut.findOrCreate({ where: { key: 'mood' }, defaults: { value: 'Great day to set your mood!' } })
      .then(res => {
        res = res[0].dataValues.value;
        return res;
      });
  }

  /**
   * Change the mood of the user
   * @param {String} newMood New mood to set
   * @return {String<newMood>}
   * @example
   * <User>.changeMood('Hello new mood!'); // => 'Hello new mood!'
   */
  changeMood(newMood) {
    if (!newMood) throw new Error('Missing mood parameter');
    return this.shortcut.findOrCreate({ where: { key: 'mood' }, defaults: { value: 'Great day to set your mood!' } })
      .then(() => {
        this.shortcut.update({ value: newMood }, { where: { key: 'mood' } }).catch(e => { throw new Error(e); });
        return newMood;
      }).catch(e => { throw new Error(e); });
  }

  /**
   * Get the badges of the user
   * @return {Array<String>}
   * @readonly
   */
  get badges() {
    return this.shortcut.findOrCreate({ where: { key: 'badges' }, defaults: { value: '' } })
      .then(res => {
        return res[0].get('value').split(' ');
      }).catch(e => { throw new Error(e); });
  }

  /**
   * Add/remove a badge from the user's profile
   * @param {'add' | 'remove'} operation Operation to perform on badges
   * @param {String} badgeName Add/remove badgeName
   * @return {Array<String>}
   * @example
   * <User>.changeBadges('add', ':wave:');    // => [':wave:', ...badges]
   * <User>.changeBadges('remove', ':wave:'); // => [...badges]
   */
  changeBadges(operation, badgeName) {
    switch (operation) {
      case 'add': {
        return this.shortcut.findOrCreate({ where: { key: 'badges' }, defaults: { value: '' } })
          .then(res => {
            const badgeArray = res[0].get('value').split(' ');
            if (badgeArray.includes(badgeName)) return false; // If the array has it already, dont go further.

            this.shortcut.update({ value: `${res[0].get('value')} ${badgeName}` }, { where: { key: 'badges' } }).catch(e => { throw new Error(e); });
            badgeArray.push(badgeName);
            return badgeArray;
          }).catch(e => { throw new Error(e); });
      }
      case 'remove': {
        return this.shortcut.findOrCreate({ where: { key: 'badges' }, defaults: { value: '' } })
          .then(res => {
            const badgeArray = res[0].get('value').split(' ');
            if (!badgeArray.includes(badgeName)) return false; // If the array does not have the badge, dont go further.

            const updated = badgeArray.splice(badgeArray.indexOf(badgeName), 1).join(' '); // Find the index of the badge, then remove (splice) it from that index
            this.shortcut.update({ value: updated }, { where: { key: 'badges' } }).catch(e => { throw new Error(e); });
            return updated;
          }).catch(e => { throw new Error(e); });
      }
      default: throw new Error('Operation must be one of "add" or "remove"');
    }
  }

  /**
   * Get the amount of reputation points this user has
   * @return {Number}
   */
  get reputation() {
    return this.shortcut.findOrCreate({ where: { key: 'reputation' }, defaults: { value: '0' } })
      .then(res => {
        return +res[0].get('value');
      });
  }

  /**
   * Change the reputation of the user
   * @param {'add' | 'subtract' | 'set'} operation Operation to perform on the user's reputation
   * @param {Number} amount Amount to add/subtract/set
   * @return {Number} The new reputation of the user
   * @example
   * <User>.changeReputation('add', 1); // 0 => 1
   * <User>.changeReputation('remove', 10); // 200 => 190
   */
  changeReputation(operation, amount) {
    if (!operation) throw new Error('Missing operation parameter');
    if (!amount) throw new Error('Missing amount parameter');
    switch (operation) {
      case 'add': {
        return this.shortcut.findOrCreate({ where: { key: 'reputation' }, defaults: { value: '0' } })
          .then(res => {
            return this.shortcut.update({ value: (+res[0].get('value') + amount).toString() }, { where: { key: 'reputation' } })
              .then(() => { return +res[0].get('value') + amount; })
              .catch(e => { throw new Error(e); });
          }).catch(e => { throw new Error(e); });
      }
      case 'subtract': {
        return this.shortcut.findOrCreate({ where: { key: 'reputation' }, defaults: { value: '0' } })
          .then(res => {
            if (+res[0].get('value') <= 0) return false;
            if (+res[0].get('value') - amount < 0) return false;

            return this.shortcut.update({ value: (+res[0].get('value') - amount).toString() }, { where: { key: 'reputation' } })
              .then(() => { return +res[0].get('value') - amount; })
              .catch(e => { throw new Error(e); });
          }).catch(e => { throw new Error(e); });
      }
      case 'set': {
        return this.shortcut.findOrCreate({ where: { key: 'reputation' }, defaults: { value: '0' } })
          .then(() => {
            return this.shortcut.update({ value: amount.toString() }, { where: { key: 'reputation' } }).then(() => {
              return amount;
            }).catch(e => { throw new Error(e); });
          }).catch(e => { throw new Error(e); });
      }
      default: throw new Error('Operation must be one of "add", "subtract", or "set".');
    }
  }

  /**
   * Gets the user from the Discord.js User object
   */
  get user() { return this.djsUser; }
}

module.exports = UserProfile;