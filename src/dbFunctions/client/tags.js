const Sequelize = require('sequelize');

module.exports = client => {
  // Tags system
  const tagBase = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'databases/tags.sqlite'
  });

  client.tags = tagBase.define('tags', {
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
    description: Sequelize.TEXT,
    username: Sequelize.STRING,
    usage_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    }
  });
  client.tags.sync();
};