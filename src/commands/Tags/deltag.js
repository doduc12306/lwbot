const Tags = require('../../dbFunctions/client/tags').tagsTable;

module.exports.run = async (client, message, args) => {
  const tagName = args;
  const rowCount = await Tags.destroy({ where: { name: tagName } });
  if (!rowCount) return message.send('❌ `|` :pencil: **Tag does not exist**');

  return message.send('✅ **Tag deleted.**');
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['removetag'],
  permLevel: 'Bot Owner'
};

exports.help = {
  name: 'deltag',
  description: 'Deletes a tag from the database',
  usage: 'deltag <tag name>',
  category: 'Tags'
};