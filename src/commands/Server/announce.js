const Discord = require('discord.js');
String.prototype.replaceAll = function (search, replacement) {
  return this.replace(new RegExp(search, 'g'), replacement);
};
module.exports.run = async (client, message, args) => {
  const settings = client.settings.get(message.guild.id);

  const messageContent = args.join(' ');
  const splitter = messageContent.split(' | ');

  const title = splitter[0];
  const part2 = splitter[1];

  if (!title) return message.send('❌ **Missing a title!**');
  if (!part2) return message.send('❌ **Missing the content!**');
  const content = part2.replaceAll('/n', '\n').trim();

  message.guild.channels.cache.find(channel => channel.name === settings.announcementsChannel).send(new Discord.MessageEmbed()
    .setColor(client.accentColor)
    .setAuthor(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
    .setTimestamp()
    .addField(title, content)
  );

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  permLevel: 'Moderator',
  aliases: ['anno'],
  requiresEmbed: true
};

exports.help = {
  name: 'announce',
  description: 'Announces something',
  usage: 'announce <title> | <content>',
  category: 'Server'
};