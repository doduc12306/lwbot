const User = require('../../dbFunctions/client/user');
module.exports.run = (client, message) => {
  new User(message.author.id).changeBalance('add', 200);
  message.send(':white_check_mark: `|` :bank: **Added** `200` **Kowoks to your account!**');
};

exports.conf = {
  enabled: true,
  aliases: [],
  guildOnly: false,
  permLevel: 'User',
  cooldown: 8.64e+7
};

exports.help = {
  name: 'daily',
  description: 'Get your daily Kowoks',
  usage: 'daily',
  category: 'Economy'
};