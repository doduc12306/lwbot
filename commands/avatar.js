module.exports.run = (client, message, args) => message.channel.send(`Avatar for **${message.mentions.users.first() ? message.mentions.users.first().tag : message.author.tag}**`, {files: [message.mentions.users.first() ? message.mentions.users.first().avatarURL.split('?size')[0] : message.author.avatarURL.split('?size')[0]]});

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