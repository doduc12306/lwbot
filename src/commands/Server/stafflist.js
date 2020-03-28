const Discord = require('discord.js');
module.exports.run = async (client, message) => {

  message.send('<a:loading:536942274643361794> **Gathering information...**').then(msg => {
    const embed = new Discord.MessageEmbed()
      .setColor(message.guild.owner.roles.highest.color === 0 ? client.accentColor : message.guild.owner.roles.highest.color)
      .setAuthor(message.guild.name, message.guild.iconURL());

    const owners = message.guild.members.cache.filter(g => (client.permlevel(g) === 5 || g === message.guild.owner)).map(g => g.toString());
    embed.addField(`Owner${owners.length === 1 ? '' : 's'}`, owners.join('\n'), true);

    const botCommanders = message.guild.members.cache.filter(g => client.permlevel(g) === 4).map(g => g.toString());
    if (botCommanders.length > 0) embed.addField(`Bot Commander${botCommanders.length === 1 ? '' : 's'}`, botCommanders.join('\n'), true);

    const admins = message.guild.members.cache.filter(g => client.permlevel(g) === 3).map(g => g.toString());
    if (admins.length > 0) embed.addField(`Admin${admins.length === 1 ? '' : 's'}`, admins.join('\n'), true);

    const mods = message.guild.members.cache.filter(g => client.permlevel(g) === 2).map(g => g.toString());
    if (mods.length > 0) embed.addField(`Mod${mods.length === 1 ? '' : 's'}`, mods.join('\n'), true);

    msg.edit('', { embed });
  });
};

exports.conf = {
  enabled: true,
  aliases: ['staff'],
  permLevel: 'User',
  guildOnly: true,
  requiresEmbed: true
};

exports.help = {
  name: 'stafflist',
  description: 'Lists the server\'s staff',
  usage: 'stafflist',
  category: 'Server'
};