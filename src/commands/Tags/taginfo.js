module.exports.run = async (client, message, args) => {
  const tagName = args;

  // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
  const tag = await client.tags.findOne({ where: { name: tagName } });
  if (tag) {
    return message.send(`:information_source: **\`${tagName}\` created by \`${tag.username}\` at \`${require('moment')(tag.createdAt).format('MM/DD/YYYY HH:mm')}\`\n\t\t Used ${tag.usage_count} times**`);
  }
  return message.send(`❌ **\`${tagName}\` does not exist**`);
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