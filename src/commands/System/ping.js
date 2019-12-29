module.exports.run = (client, message) => message.send(`:ping_pong: \`${Math.round(client.ping)}ms\``).then(msg => msg.edit(`${msg.content} • **Latency:** \`${msg.createdAt - message.createdAt}ms\``));

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['pong', 'p', 'pnig', '🏓', 'pimg'],
  permLevel: 'User'
};

exports.help = {
  name: 'ping',
  category: 'System',
  description: 'Ping pong! 🏓',
  usage: 'ping'
};