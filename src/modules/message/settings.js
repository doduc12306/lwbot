const Sequelize = require('sequelize');

module.exports = (client, message) => {
  if (message.channel.type === 'dm') return;

  const guildTable = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: `databases/servers/${message.guild.id}.sqlite`
  });

  // Guild settings support
  message.guild.settings = guildTable.define('settings', {
    key: {
      type: Sequelize.STRING,
      allowNull: false
    },
    value: Sequelize.STRING
  }, { timestamps: false });
  guildTable.sync();

  /**
   *
   * @param {String} key The name of the setting to add
   * @param {String} value The value of the setting
   */
  message.guild.settings.add = (key, value) => {
    return new Promise((resolve, reject) => {
      if (!key) return reject(new Error('Missing key to add'));
      if (!value) return reject(new Error('Missing value to add'));
      if (typeof key !== 'string') return reject(new TypeError(`"${key}" is not a string`));
      if (typeof value !== 'string') return reject(new TypeError(`"${value}" is not a string`));
      if (key.includes(' ')) return reject(new Error(`"${key}" must be one word`));

      message.guild.settings.create({ key: key, value: value })
        .then(() => {
          client.settings.get(message.guild.id)[key] = value;
          return resolve(true);
        })
        .catch(e => {
          return reject(new Error(e));
        });
    });
  };

  /**
   *
   * @param {String} key The name of the setting to delete
   */
  message.guild.settings.delete = key => {
    return new Promise((resolve, reject) => {
      if (!key) return reject(new Error('Missing key to delete'));
      if (typeof key !== 'string') return reject(new TypeError(`"${key}" is not a string`));
      message.guild.settings.findOne({ where: { key: key } }).then(data => {
        if (data === null) return reject(new Error(`The key "${key}" does not exist to delete`));
        delete client.settings.get(message.guild.id)[key];
        message.guild.settings.destroy({ where: { key: key } });
        return resolve(true);
      });
    });
  };
  message.guild.settings.remove = key => message.guild.settings.delete(key);

  /**
   *
   * @param {String} key The name of the setting to edit
   * @param {String} newValue The new value of the setting
   */
  message.guild.settings.edit = (key, newValue) => {
    return new Promise((resolve, reject) => {
      if (!key) return reject(new Error('Missing key to edit'));
      if (!newValue) return reject(new Error('Missing value to edit'));
      if (typeof key !== 'string') return reject(new TypeError(`"${key}" is not a string`));
      if (typeof newValue !== 'string') return reject(new TypeError(`"${newValue}" is not a string`));

      message.guild.settings.findOne({ where: { key: key } }).then(data => {
        if (data === null) return reject(new Error(`The key "${key}" does not exist to edit`));
        client.settings.get(message.guild.id)[key] = newValue;
        message.guild.settings.update({ value: newValue }, { where: { key: key } });
        return resolve(true);
      });
    });
  };
  message.guild.settings.set = (key, newValue) => message.guild.settings.edit(key, newValue);

  /**
   *
   * @param {String} key The name of the key to get
   */
  message.guild.settings.get = key => {
    return new Promise((resolve, reject) => {
      if (!key) return reject(new Error('Missing key to get'));
      if (typeof key !== 'string') return reject(new TypeError(`"${key}" is not a string`));

      message.guild.settings.findOne({ where: { key: key } }).then(data => {
        if (data === null) return reject(new Error(`"${key}" does not exist to get`));
        return resolve(data.value);
      });
    });
  };
};