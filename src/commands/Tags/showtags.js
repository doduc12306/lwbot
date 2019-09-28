module.exports.run = async (client, message) => {
  message.send('<a:loading:536942274643361794> `|` :pencil: **Loading tags...**').then(async msg => {
    // equivalent to: SELECT name FROM tags;
    const tagList = await client.tags.findAll({ attributes: ['name'] });
    const tagString = tagList.map(t => t.name).join(', ') || 'No tags found.';
    return msg.edit(`:pencil: **List of tags:** ${tagString}`);
  });
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