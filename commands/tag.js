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
    // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
    tag.increment('usage_count');
    return message.channel.send(tag.get('description'));
  }
  return message.reply(`Could not find tag: ${tagName}`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['findtag'],
  permLevel: 'User'
};

exports.help = {
  name: 'tag',
  description: 'Find a tag particular tag',
  usage: 'tag <tag name>',
  category: 'Tags'
};