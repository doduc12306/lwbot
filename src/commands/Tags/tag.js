module.exports.run = async (client, message, args) => {
  const tagName = args;
  // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
  const tag = await client.tags.findOne({ where: { name: tagName } });
  if (tag) {
    // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
    tag.increment('usage_count');
    return message.channel.send(tag.get('description'));
  }
  return message.channel.send(`:x: **\`${tagName}\` does not exist**`);
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