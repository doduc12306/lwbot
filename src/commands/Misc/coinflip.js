module.exports.run = (client, message) => {
  const oneOrZero = Math.ceil((Math.random() * 2)) % 2; // 1 = Odd, 0 = Even

  if(oneOrZero === 0) return message.send('**Heads!**');
  else return message.send('**Tails!**');
};

exports.conf = {
  enabled: true,
  aliases: ['flipacoin', 'cf'],
  guildOnly: false,
  permLevel: 'User'
};

exports.help = {
  name: 'coinflip',
  description: 'Flip a coin!',
  usage: 'coinflip',
  category: 'Misc'
};