module.exports.run = (client, message) => message.send('( ͡° ͜ʖ ͡°)');

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['lennyface'],
  permLevel: 'User',
  hidden: true
};

exports.help = {
  name: 'lenny',
  description: '( ͡° ͜ʖ ͡°)',
  usage: 'lenny',
  category: 'Fun'
};