const Sequelize = require('sequelize');
const { Client, Guild } = require('discord.js'); // eslint-disable-line no-unused-vars

module.exports.table = (guildID) => {
  if (!guildID) throw new Error('guildID parameter is undefined');
  if (guildID instanceof Guild) guildID = guildID.id;
  if (typeof guildID !== 'string') throw new Error('guildID is not a string (ID)');
  return new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: `databases/servers/${guildID}.sqlite`,
    operatorsAliases: false
  });
};

module.exports.settingsSchema = (table) => {
  if (!table) throw new Error('table parameter is undefined');
  return table.define('settings', {
    key: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    value: Sequelize.STRING
  }, { timestamps: false });
};

module.exports.functions = {

  /**
   * The schema used to create database#settings
   * @readonly
   * @param {String} guildID The ID used to get the database, which is then passed into the schema
   */
  settingsSchema: (guildID) => this.settingsSchema(this.table(guildID)),

  /**
   * Adds a setting to the database
   * @param {Client} client The client used to initiate the discord connection
   * @param {String} guildID The ID of a guild to use to access/create a database
   * @param {String} key The name of the setting to add
   * @param {String} value The value of the setting
   */
  add: (client, guildID, key, value) => {
    return new Promise((resolve, reject) => {
      if (!key) return reject(new Error('Missing key to add'));
      if (!value) return reject(new Error('Missing value to add'));
      if (typeof key !== 'string') return reject(new TypeError(`"${key}" is not a string`));
      if (typeof value !== 'string') return reject(new TypeError(`"${value}" is not a string`));
      if (key.includes(' ')) return reject(new Error(`"${key}" must be one word`));

      this.functions.settingsSchema(guildID).create({ key: key, value: value })
        .then(() => {
          client.settings.get(guildID)[key] = value;
          return resolve(true);
        })
        .catch(e => {
          return reject(new Error(e));
        });
    });
  },

  /**
   * Deletes a setting from the database
   * @param {Client} client The client used to initiate the discord connection
   * @param {String} guildID The ID of a guild to use to access/create a database
   * @param {String} key The name of the setting to delete
   */
  delete: (client, guildID, key) => {
    return new Promise((resolve, reject) => {
      if (!key) return reject(new Error('Missing key to delete'));
      if (typeof key !== 'string') return reject(new TypeError(`"${key}" is not a string`));
      this.functions.settingsSchema(guildID).findOne({ where: { key: key } }).then(data => {
        if (!data) return reject(new Error(`The key "${key}" does not exist to delete`));
        delete client.settings.get(guildID)[key];
        this.functions.settingsSchema(guildID).destroy({ where: { key: key } });
        return resolve(true);
      });
    });
  },

  /**
   * Edits a setting in the database
   * @param {Client} client The client used to initiate the discord connection
   * @param {String} guildID The ID of a guild to use to access/create a database
   * @param {String} key The name of the setting to edit
   * @param {String} newValue The value of the setting
   */
  edit: (client, guildID, key, newValue) => {
    return new Promise((resolve, reject) => {
      if (!key) return reject(new Error('Missing key to edit'));
      if (!newValue) return reject(new Error('Missing value to edit'));
      if (typeof key !== 'string') return reject(new TypeError(`"${key}" is not a string`));
      if (typeof newValue !== 'string') return reject(new TypeError(`"${newValue}" is not a string`));

      this.functions.settingsSchema(guildID).findOne({ where: { key: key } }).then(data => {
        if (!data) return reject(new Error(`The key "${key}" does not exist to edit`));
        client.settings.get(guildID)[key] = newValue;
        this.functions.settingsSchema(guildID).update({ value: newValue }, { where: { key: key } });
        return resolve(true);
      });
    });
  },

  /**
   * Gets a setting from the database
   * @param {String} guildID The ID of a guild to use to access/create a database
   * @param {String} key The name of the setting to get
   */
  get: (guildID, key) => {
    return new Promise((resolve, reject) => {
      if (!key) return reject(new Error('Missing key to get'));
      if (typeof key !== 'string') return reject(new TypeError(`"${key}" is not a string`));

      this.functions.settingsSchema(guildID).findOne({ where: { key: key } }).then(data => {
        if (!data) return reject(new Error(`"${key}" does not exist to get`));
        return resolve(data.value);
      });
    });
  }
};