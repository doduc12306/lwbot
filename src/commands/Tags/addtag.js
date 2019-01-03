module.exports.run = async (client, message, args) => {
  const tagName = args.shift();
  const tagDescription = args.join(' ');

  try {
    // equivalent to: INSERT INTO tags (name, descrption, username) values (?, ?, ?);
    const tag = await client.tags.create({
      name: tagName,
      description: tagDescription,
      username: message.author.username,
    });
    return message.send(`:white_check_mark: **\`${tag.name}\` created.**`);
  }
  catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') return message.reply(':x: **Tag already exists**');
    return message.send(`Something went wrong with adding a tag.
        ${e}`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['createtag', 'tagadd'],
  permLevel: 'Bot Owner'
};

exports.help = {
  name: 'addtag',
  description: 'Adds a tag to the database',
  usage: 'addtag <tag name> <tag data>\n**Tag name must be one word**',
  category: 'Tags'
};