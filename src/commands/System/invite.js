const Discord = require('discord.js');
module.exports.run = (client) => client.users.get(client.config.ownerID).send(new Discord.RichEmbed().setTitle('Invite me to another server!').setDescription(`https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=1610083703&scope=bot`).setColor(client.config.colors.green));

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: 'Bot Owner',
  guildOnly: false
};

exports.help = {
  name: 'invite',
  description: 'Invite the bot to another server',
  usage: 'invite',
  category: 'System'
};