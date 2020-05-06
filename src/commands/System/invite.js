const { MessageEmbed } = require('discord.js');
module.exports.run = async (client, message) => {
  message.send(new MessageEmbed()
    .setColor(client.accentColor)
    .setTitle('Invite me to another server!')
    .setDescription(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=2146823415&scope=bot`)
  );
};

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