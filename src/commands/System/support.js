module.exports.run = (client, message) => message.send('**Are you having issues? Join our support server:** https://discord.gg/225Kyt5');

exports.conf = {
  enabled: true,
  permLevel: 'User',
  aliases: [],
  guildOnly: false
};

exports.help = {
  name: 'support',
  description: 'Get bot support',
  usage: 'support',
  category: 'System'
};