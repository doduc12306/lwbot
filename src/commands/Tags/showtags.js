module.exports.run = async (client, message) => {
  // equivalent to: SELECT name FROM tags;
  const tagList = await client.tags.findAll({ attributes: ['name'] });
  const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
  return message.send(`**List of tags:** ${tagString}`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['listtags', 'showalltags', 'tags'],
  permLevel: 'User'
};

exports.help = {
  name: 'showtags',
  description: 'Shows all available tags',
  usage: 'showtags',
  category: 'Tags'
};