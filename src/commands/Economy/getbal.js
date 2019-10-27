const User = require('../../dbFunctions/client/user');
module.exports.run = async (client, message) => {
  if(message.mentions.users.first()) {
    const user = new User(message.mentions.users.first().id);
    message.send(`:bank: ${user.user.toString()}**'s balance is** \`${await user.balance}\` **Kowoks**`);
  } else {
    const user = new User(message.author.id);
    message.send(`:bank: **Your balance is** \`${await user.balance}\` **Kowoks**`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['balance', 'money', '$'],
  permLevel: 'User'
};

exports.help = {
  name: 'getbal',
  description: 'Get the balance of yourself or another person',
  usage: 'getbal [@user]',
  category: 'Economy'
};