const Discord = require('discord.js');

module.exports.run = (client, message, args) => {
  var command = client.commands.get(args[0]);

  var embed = new Discord.RichEmbed()
    .addField(command.help.name, `Enabled: ${command.conf.enabled}`);

  if(command.conf.enabled) embed.setColor(client.config.colors.green);
  else embed.setColor(client.config.colors.red);

  message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User'
};

exports.help = {
  name: 'diagnose',
  description: 'See if a command is enabled/disabled',
  usage: 'diagnose <command>',
  category: 'System'
};