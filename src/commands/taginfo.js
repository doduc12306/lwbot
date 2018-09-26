const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: 'tags.sqlite',
});
    
const Tags = sequelize.define('tags', {
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
  },
});

module.exports.run = async (client, message, args) => {
  const tagName = args;

  // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
  const tag = await Tags.findOne({ where: { name: tagName } });
  if (tag) {
    return message.channel.send(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
  }
  return message.reply(`Could not find tag: ${tagName}`); 
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User'
};

exports.help = {
  name: 'taginfo',
  description: 'Shows the information of particular tag',
  usage: 'taginfo <tag name>',
  category: 'Tags'
};