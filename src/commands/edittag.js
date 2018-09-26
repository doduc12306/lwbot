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

  const tagName = args.shift();
  const tagDescription = args.join(' ');

  // equivalent to: UPDATE tags (descrption) values (?) WHERE name='?';
  const affectedRows = await Tags.update({ description: tagDescription }, { where: { name: tagName } });
  if (affectedRows > 0) {
    return message.reply(`Tag ${tagName} was edited.`);
  }
  return message.reply(`Could not find a tag with name ${tagName}.`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['etag'],
  permLevel: 'Bot Owner'
};

exports.help = {
  name: 'edittag',
  description: 'Edits a particular tag',
  usage: 'edittag <tag name> <new tag data>',
  category: 'Tags'
};