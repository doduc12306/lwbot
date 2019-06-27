const Discord = require('discord.js');

module.exports.run = (client, message) => {
  const pings = client.pings.filter(g => g !== undefined).join(', ');

  message.send(new Discord.RichEmbed()
    .addField('🏓 Ping', 'Pinging... (Pinging...)')
    .addField('↔ Latency', 'Pinging...')
    .setColor(client.config.colors.yellow)
  ).then(thismessage => {
    thismessage.edit(new Discord.RichEmbed()
      .addField('🏓 Ping', `${Math.round(client.ping)}ms (${pings})`)
      .addField('↔ Latency', `${thismessage.createdAt-message.createdAt}ms`)
      .setColor(message.guild.accentColor)
    );
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['pong', 'p', 'pnig', '🏓'],
  permLevel: 'User',
  requiresEmbed: true
};

exports.help = {
  name: 'ping',
  category: 'System',
  description: 'Ping pong! 🏓',
  usage: 'ping'
};