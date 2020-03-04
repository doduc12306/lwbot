const Sequelize = require('sequelize');
const { Guild } = require('discord.js'); // eslint-disable-line no-unused-vars
const client = require('../../startup').client;

class GuildEvents {
  constructor(guildID) {
    if (guildID instanceof Guild) guildID = guildID.id;

    const guild = client.guilds.cache.get(guildID);
    if (!guild) throw new Error(`Guild (${guildID}) does not exist to get.`);

    this.guildID = guildID;
    this.djsGuild = guild;

    this.cachedEvents = client.events.get(guildID);
  }

  /**
   * The table of the guild events
   */
  table() {
    return new Sequelize('database', 'user', 'password', {
      host: 'localhost',
      dialect: 'sqlite',
      logging: false,
      storage: `databases/servers/${this.guildID}.sqlite`,
      transactionType: 'IMMEDIATE' // Setting this helps with the "SQLITE_BUSY: Database is locked" errors
    });
  }

  /**
   * The schema used to poll the database table
   */
  guildSchema() {
    return this.table().define('events', {
      event: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    }, { timestamps: false });
  }

  /**
   * Simple shortcut to the table using the guild ID provided earlier
   */
  get shortcut() {
    return this.guildSchema(this.table(this.guildID));
  }

  /**
   * Enables an event to be logged
   * @param {String} eventName The event to enable
   * @return {Promise<Object>} GuildEvents
   */
  enable(eventName) {
    return new Promise((resolve, reject) => {
      if (!eventName) return reject(new Error('Missing event to get'));
      if (typeof eventName !== 'string') return reject(new TypeError(`"${eventName}" is not a string`));

      const event = this.shortcut.findOne({ where: { event: eventName} });
      if(!event) return reject(new Error(`"${eventName}" does not exist to get`));

      this.shortcut.update({ enabled: true }, { where: { event: eventName }});
      this.cachedEvents[eventName] = true;

      return resolve(this.cachedEvents);
    });
  }

  /**
   * Disables an event to be logged
   * @param {String} eventName The event to disable
   * @return {Promise<Object>} GuildEvents
   */
  disable(eventName) {
    return new Promise((resolve, reject) => {
      if (!eventName) return reject(new Error('Missing event to get'));
      if (typeof eventName !== 'string') return reject(new TypeError(`"${eventName}" is not a string`));

      const event = this.shortcut.findOne({ where: { event: eventName} });
      if(!event) return reject(new Error(`"${eventName}" does not exist to get`));

      this.shortcut.update({ enabled: false }, { where: { event: eventName }});
      this.cachedEvents[eventName] = false;

      return resolve(this.cachedEvents);
    });
  }

  /**
   * Gets an event from the database
   * @param {String} [eventName] The name of the event to get 
   * @return {Promise<String>|Promise<Object>} Value of event | GuildEvents
   */
  get(eventName) {
    return new Promise((resolve, reject) => {
      if (!eventName) return resolve(this.cachedEvents);
      if (typeof eventName !== 'string') return reject(new TypeError(`"${eventName}" is not a string`));

      const event = this.shortcut.findOne({ where: { event: eventName } });
      if (!event) return reject(new Error(`"${eventName}" does not exist to get`));

      return resolve(this.cachedEvents[eventName]);
    });
  }
}

module.exports = GuildEvents;