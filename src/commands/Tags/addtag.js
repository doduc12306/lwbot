const Tags = require('../../dbFunctions/client/tags').tagsTable;

module.exports.run = async (client, message, args) => {
  const tagName = args.shift();
  const tagDescription = args.join(' ');

  try {
    // equivalent to: INSERT INTO tags (name, descrption, username) values (?, ?, ?);
    const tag = await Tags.create({
      name: tagName,
      description: tagDescription,
      username: message.author.username,
    });
    return message.send(`✅ \`|\` :pencil: **\`${tag.name}\` created.**`);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') return message.reply('❌ `|` :pencil: **Tag already exists**');
    return message.send(`❌ \`|\` :pencil: **Something went wrong with adding a tag.**
        ${e}`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['createtag', 'tagadd'],
  permLevel: 'Bot Support'
};

exports.help = {
  name: 'addtag',
  description: 'Adds a tag to the database',
  usage: 'addtag <tag name> <tag data>\n**Tag name must be one word**',
  category: 'Tags'
};