const Discord = require('discord.js');

module.exports.run = (client, message) => {
  var pings = client.pings.filter(g => g !== undefined).join(', ');

  message.channel.send(new Discord.RichEmbed()
    .addField(':ping_pong: Ping', 'Pinging... (Pinging...)')
    .addField(':left_right_arrow: Latency', 'Pinging...')
    .setColor(client.config.colors.yellow)
  ).then(thismessage => {
    thismessage.edit(new Discord.RichEmbed()
      .addField(':ping_pong: Ping', `${Math.round(client.ping)}ms (${pings})`)
      .addField(':left_right_arrow: Latency', `${thismessage.createdAt-message.createdAt}ms`)
      .setColor(client.config.colors.green)
    );
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User',
  requiresEmbed: true
};

exports.help = {
  name: 'ping',
  category: 'System',
  description: 'Ping pong! 🏓',
  usage: 'ping'
};