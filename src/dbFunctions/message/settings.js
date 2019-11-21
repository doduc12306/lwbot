const Sequelize = require('sequelize');
const { Guild } = require('discord.js'); // eslint-disable-line no-unused-vars
const client = require('../../startup').client;

class GuildSettings {
  constructor(guildID) {
    if(guildID instanceof Guild) guildID = guildID.id; // If the guildID passed is actually a d.js guild object, turn it into an id that the class can handle.

    const guild = client.guilds.get(guildID);
    if(!guild) throw new Error(`Guild (${guildID}) does not exist to get.`);

    this.guildID = guildID;
    this.djsGuild = guild;

    this.cachedSettings = client.settings.get(guildID);
  }

  /**
   * The table of the guild settings
   */
  table() {
    return new Sequelize('database', 'user', 'password', {
      host: 'localhost',
      dialect: 'sqlite',
      logging: false,
      storage: `databases/servers/${this.guildID}.sqlite`
    });
  }

  /**
   * The schema used to poll the database table
   */
  guildSchema() {
    return this.table().define('settings', {
      key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      value: Sequelize.STRING
    }, { timestamps: false });
  }

  /**
   * Simple shortcut to the table using the guild ID provided earlier
   */
  get shortcut() {
    return this.guildSchema(this.table(this.guildID));
  }

  /**
   * Adds a setting to the database
   * @param {String} key The name of the setting to add
   * @param {String} value The value of the setting
   * @return {Promise<Object>} GuildSettings
   */
  add(key, value) {
    return new Promise((resolve, reject) => {
      if(!key) return reject(new Error('Missing key parameter'));
      if(!value) return reject(new Error('Missing value parameter'));

      if(typeof key !== 'string') return reject(new Error('Key parameter is not a string'));
      if(typeof value !== 'string') return reject(new Error('Value parameter is not a string'));

      this.shortcut.create({ key, value }).catch(e => reject(new Error(`Error creating new setting in database:\n\t${e}`)));
      
      this.cachedSettings[key] = value;
      return resolve(this.cachedSettings);
    });
  }
  /**
   * @see GuildSettings#add
   */
  create(key, value) { return this.add(key, value); }

  /**
   * Deletes a setting from the database
   * @param {String} key The name of the setting to delete
   * @return {Promise<Object>} GuildSettings
   */
  delete(key) {
    return new Promise((resolve, reject) => {
      if (!key) return reject(new Error('Missing key to delete'));

      if (typeof key !== 'string') return reject(new TypeError(`"${key}" is not a string`));

      const setting = this.shortcut.findOne({ where: { key }});
      if(!setting) return reject(new Error(`"${key}" does not exist to delete`));
      
      this.shortcut.destroy({ where: { key } });
      delete this.cachedSettings[key];

      return resolve(this.cachedSettings);
    });
  }

  /**
   * Edits a setting in the database
   * @param {String} key The name of the setting to edit
   * @param {String} newValue The value of the setting
   * @return {Promise<Object>} GuildSettings
   */
  edit(key, newValue) {
    return new Promise((resolve, reject) => {
      if (!key) return reject(new Error('Missing key to edit'));
      if (!newValue) return reject(new Error('Missing value to edit'));
      if (typeof key !== 'string') return reject(new TypeError(`"${key}" is not a string`));
      if (typeof newValue !== 'string') return reject(new TypeError(`"${newValue}" is not a string`));

      const setting = this.shortcut.findOne({ where: { key }});
      if(!setting) return reject(new Error(`"${key}" does not exist to edit`));

      this.shortcut.update({ value: newValue }, { where: { key }});
      this.cachedSettings[key] = newValue;

      return resolve(this.cachedSettings);
    });
  }

  /**
   * Gets a setting from the database
   * @param {String} [key] The name of the setting to get 
   * @return {Promise<String>|Promise<Object>} Value of key | GuildSettings
   */
  get(key) {
    return new Promise((resolve, reject) => {
      if (!key) return resolve(this.cachedSettings);
      if (typeof key !== 'string') return reject(new TypeError(`"${key}" is not a string`));

      const setting = this.shortcut.findOne({ where: { key }});
      if(!setting) return reject(new Error(`"${key}" does not exist to get`));

      return resolve(this.cachedSettings[key]);
    });
  }

}

module.exports = GuildSettings;