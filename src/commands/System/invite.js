const { RichEmbed } = require('discord.js');
module.exports.run = async (client, message) => {
  message.author.send(new RichEmbed()
    .setColor(message.guild.accentColor)
    .setTitle('Invite me to another server!')
    .setDescription(`[${await client.generateInvite(['ADMINISTRATOR'])}](Click here!)`)
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