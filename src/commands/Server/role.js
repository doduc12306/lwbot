const Discord = require('discord.js');
const moment = require('moment');
module.exports.run = (client, message, args) => {
  let role = message.mentions.roles.size === 0 ? args[0] : message.mentions.roles.first();
  try {
    role = message.functions.parseRole(role);

    const embed = new Discord.RichEmbed()
      .setColor(role.color === 0 ? message.guild.accentColor : role.color)
      .addField('Name', role.name, true)
      .addField('ID', role.id, true)
      .addField('Created', moment(role.createdAt).format('MMM Do YYYY, h:mm a'), true)
      .addField('Position', `${role.position} (of ${message.guild.roles.size-1})`, true)
      .addField('Members', `${role.members.size} (${role.members.filter(g => g.user.presence.status === 'online').size} online)`, true)
      .addField('Mentionable', role.mentionable ? 'Yes' : 'No', true)
      .addField('Managed', role.managed ? 'Yes' : 'No', true)
      .addField('Hoisted', role.hoist ? 'Yes' : 'No', true);

    role.color === 0 ? true : embed.addField('Color', '#'+role.color.toString(16), true);

    message.send(embed);
  } catch (e) {message.send(`❌ **${e}**`);}
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['roleinfo'],
  permLevel: 'User',
  requiresEmbed: true
};

exports.help = {
  name: 'role',
  description: 'Find information of a role',
  usage: 'role <role name/id>',
  category: 'Server'
};