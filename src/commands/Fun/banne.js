module.exports.run = async (client, message) => {
  if (message.mentions.users.size === 0) return message.send(`${client.emojis.cache.get('383800708841078785')} **u didnt menshin sum1!!~** 😤 😤`);
  message.send(`${client.emojis.cache.get('383763992981667855')} ${message.mentions.users.first()} **has bee banne~!!1!** ✨`);
};

exports.conf = {
  enabled: true,
  aliases: [],
  guildOnly: true,
  permLevel: 'User'
};

exports.help = {
  name: 'banne',
  description: 'banne a somone~! ✨',
  usage: 'banne <@user>',
  category: 'Fun'
};