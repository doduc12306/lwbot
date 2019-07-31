module.exports.run = (client, message) => {
  const user = message.mentions.users.first() ? message.mentions.users.first() : message.author;
  const userAvatar = user.displayAvatarURL.split('?size=')[0];
  message.send(`Avatar for **${user.tag}**`, {files: [userAvatar]});
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