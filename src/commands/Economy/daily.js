const User = require('../../dbFunctions/client/user');
module.exports.run = (client, message) => {
  new User(message.author.id).changeBalance('add', 200);
  message.send('✅ `|` 🏦 **Added** `200` **Cubits to your account!**');
};

exports.conf = {
  enabled: true,
  aliases: [],
  guildOnly: false,
  permLevel: 'User',
  cooldown: 8.64e+7,
  failoverDisabled: true
};

exports.help = {
  name: 'daily',
  description: 'Get your daily Cubits',
  usage: 'daily',
  category: 'Economy'
};