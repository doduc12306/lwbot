module.exports.run = async (client, message, args) => {
  var toBanne = await message.functions.parseUser(args[0]);

  if (typeof toBanne.catch === 'function') return message.channel.send(`${client.emojis.get('383800708841078785')} **u can no banne no user~!** :triumph: :triumph:`);

  message.channel.send(`${client.emojis.get('383763992981667855')} **${toBanne} has ben banne~!** :sparkles:`);
};

exports.conf = {
  enabled: true,
  aliases: [],
  guildOnly: true,
  permLevel: 'User'
};

exports.help = {
  name: 'banne',
  description: 'banne a somone~! :sparkles:',
  usage: 'banne <@user>',
  category: 'Fun'
};