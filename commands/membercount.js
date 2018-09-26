const Discord = require('discord.js');
module.exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars
  await message.guild.fetchMembers();

  var bots = message.guild.members.filter(member => member.user.bot).map(g => g.toString()).length;
  var online = message.guild.members.filter(member => !member.user.bot).filter(g => g.user.presence.status === 'online').size;
  var idle = message.guild.members.filter(member => !member.user.bot).filter(g => g.user.presence.status === 'idle').size;
  var dnd = message.guild.members.filter(member => !member.user.bot).filter(g => g.user.presence.status === 'dnd').size;
  var offline = message.guild.members.filter(member => !member.user.bot).filter(g => g.user.presence.status === 'offline').size;
  var streaming = message.guild.members.filter(member => !member.user.bot).filter(g => g.user.presence.streaming).size;

  var embed = new Discord.RichEmbed()
    .addField('Total Users', message.guild.memberCount, true)
    .addField('Bots', bots, true)
    .addField('Humans', message.guild.memberCount-bots, true)
    .addField('Status', `<:online:450674128777904149> **Online:** ${online}\n<:idle:450674222176403456> **Idle:** ${idle}\n<:dnd:450674354163023882> **Do Not Disturb:** ${dnd}\n<:offline:450674445670154240> **Offline:** ${offline}\n<:streaming:450674542717698058> **Streaming:** ${streaming}`)
    .setColor(client.config.colors.green);

  message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['mc', 'members', 'users'],
  permLevel: 'User'
};

exports.help = {
  name: 'membercount',
  category: 'Server',
  description: 'Shows the number of users in the server',
  usage: 'membercount'
};