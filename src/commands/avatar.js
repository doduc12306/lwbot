module.exports.run = (client, message) => {
  var user = message.mentions.users.first() ? message.mentions.users.first() : message.author;
  var userAvatar = user.avatarURL.split('?size=')[0];
  message.channel.send(`Avatar for **${user.tag}**`, {files: [userAvatar]});
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  permLevel: 'User',
  aliases: []
};

exports.help = {
  name: 'avatar',
  description: 'Find the avatar of yourself or another user',
  usage: 'avatar [@user]',
  category: 'Misc'
};