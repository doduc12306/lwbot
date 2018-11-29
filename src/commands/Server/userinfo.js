const Discord = require('discord.js');
var moment = require('moment');

module.exports.run = (client, message) => {
  const member = message.mentions.members.size === 0 ? message.member : message.mentions.members.first();
  const { user } = member;

  const embed = new Discord.RichEmbed()
    .setAuthor(user.tag, user.avatarURL)
    .addField('ID', user.id, true)
    .setThumbnail(user.avatarURL)
    .setDescription(user.toString())
    .addField('Status', user.presence.status === 'online' ? '<:online:450674128777904149> Online' : user.presence.status === 'dnd' ? '<:dnd:450674354163023882> Do Not Disturb' : user.presence.status === 'idle' ? '<:idle:450674222176403456> Idle' : `<:streaming:450674542717698058> Streaming [${user.presence.game.name}](${user.presence.game.url})`, true);

  if(user.presence.game && !user.presence.game.streaming) embed.addField('Game', user.presence.game.name, true);

  if(member.nickname) embed.addField('Nickname', member.nickname, true);

  embed.setColor(member.displayColor === 0 ? client.config.colors.green : member.displayColor);
  embed.addField('Joined', moment(member.joinedAt).format('MMM Do YYYY, h:mm a'), true);
  embed.addField('Registered', moment(user.createdAt).format('MMM Do YYYY, h:mm a'), true);

  if(member.roles.size > 1) {
    const roles = member.roles.filter(({ id }) => id !== message.guild.id).map((role) => role.toString()).join(' ').trim();
    embed.addField('Roles', roles.length > 1024 ? `${member.roles.size} roles.` : roles, true);
  }

  message.channel.send(embed).catch((e) => {
    message.channel.send(e);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['whois', 'user'],
  permLevel: 'User'
};

exports.help = {
  name: 'userinfo',
  description: 'Shows a user\'s information',
  usage: 'userinfo [user]',
  category: 'Server'
};
