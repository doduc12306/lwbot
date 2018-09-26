module.exports.run = (client, message) => message.channel.send('( ͡° ͜ʖ ͡°)');

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['( ͡° ͜ʖ ͡°)', 'lennyface'],
  permLevel: 'User'
};

exports.help = {
  name: 'lenny',
  description: '( ͡° ͜ʖ ͡°)',
  usage: 'lenny',
  category: 'Fun'
};