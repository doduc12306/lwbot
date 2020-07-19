const Sequelize = require('sequelize');
const { Guild } = require('discord.js');
const logger = require('../../util/Logger');
const { client } = require('../../startup');

class GuildWordFilter {
  constructor(guildID) {
    if (!guildID) throw new Error('Missing guild ID');
    if (guildID instanceof Guild) {
      logger.warn('Passed guild object when it was supposed to be the ID. Converting now...');
      guildID = guildID.id;
    }
    if (!client.guilds.cache.get(guildID)) throw new Error('Guild does not exist to get');

    this.guildID = guildID;
    this.guildObject = client.guilds.cache.get(guildID);
  }

  /**
   * The database that controls all of the guild things
   * @returns Sequelize Database
   */
  get database() {
    return new Sequelize('database', 'username', 'password', {
      host: 'localhost',
      dialect: 'sqlite',
      logging: false,
      storage: `databases/servers/${this.guildID}.sqlite`,
      transactionType: 'IMMEDIATE'
    });
  }

  /**
   * The table that contains the self-assignable words for the guild
   * @returns Sequelize Table
   */
  get table() {
    return this.database.define('filter', {
      word: { type: Sequelize.STRING, allowNull: false }
    }, { timestamps: false, freezeTableName: true });
  }

  shortcut() {
    if(!this.guildObject.syncedDBs) {
      this.guildObject.syncedDBs = { filter: true };
      this.table.sync();
      this.guildObject.wordFilter = [];
    } else if (!this.guildObject.syncedDBs.filter) {
      this.guildObject.syncedDBs.filter = true;
      this.table.sync();
      this.guildObject.wordFilter = [];
    }

    return this.table;
  }

  /**
   * Get all of the current self-assignable words in this guild
   * @returns {Promise<Array<String>>} An array of IDs
   */
  get words() {
    return new Promise((resolve, reject) => {
      return this.shortcut().findAll().then(words => {
        if (!words) return reject(null);

        const wordArray = [];
        for (const word of words) wordArray.push(word.word);

        return resolve(wordArray);
      });
    });
  }

  /**
   * Add a word to the filter
   * @param {String} word
   * @returns {Promise<String>} The word
   */
  addWord(word) {
    return new Promise((resolve, reject) => {
      if (!word) return reject(new Error('Missing word to add'));

      this.guildObject.wordFilter.push(word);

      return this.shortcut().create({ word })
        .then(newWord => {
          return resolve(newWord.word);
        }).catch(reject);
    });
  }

  /**
   * Delete a word from the filter
   * @param {String} word
   * @returns {Boolean} true if the word deleted successfully
   */
  deleteWord(word) {
    return new Promise((resolve, reject) => {
      if (!word) return reject(new Error('Missing word to delete'));

      const indexOfWord = this.guildObject.wordFilter.indexOf(word);
      if(indexOfWord === -1) return reject(new RangeError('Word did not exist'));
      this.guildObject.wordFilter.splice(indexOfWord, 1);

      return this.shortcut().destroy({ where: { word } })
        .then(res => {
          if(res === 0) return reject(new Error('Word did not exist'));
          else return resolve(true);
        }).catch(reject);
    });
  }
}

module.exports = GuildWordFilter;