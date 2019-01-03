module.exports.run = async (client, message, args) => {

  const tagName = args.shift();
  const tagDescription = args.join(' ');

  // equivalent to: UPDATE tags (descrption) values (?) WHERE name='?';
  const affectedRows = await client.tags.update({ description: tagDescription }, { where: { name: tagName } });
  if (affectedRows > 0) {
    return message.send(`:white_check_mark: **\`${tagName}\` edited.**`);
  }
  return message.send(`:x: **\`${tagName}\` does not exist**`);
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