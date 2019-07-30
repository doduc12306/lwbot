const User = require('../../dbFunctions/client/user');

module.exports.run = async (client, message, args) => {
  const type = args[0];
  if(!['add', 'subtract', 'set', 'get'].includes(type)) return message.send('❌ | 🏦 **Please say what you would like to do:** `add`, `subtract`, `set`, or `get`');

  const user = new User(message.mentions.users.first() ? message.mentions.users.first() : message.author);
  let amount = args[1];

  if(type === 'add') {
    if(isNaN(amount)) return message.send(`❌ \`|\` 🏦 \`${amount}\` **is not a number!**`);
    amount = +amount;

    const newBalance = await user.changeBalance('add', amount);
    if (!newBalance) return message.send(`:x: \`|\` :bank: \`${user.tag}\`**'s balance is below zero! Actions cannot be performed.**`);
    message.send(`✅ \`|\` 🏦 **Successfully added** \`${amount}\` **to** \`${user.tag}\`**.** New balance: \`${newBalance}\`.`);
  }

  if(type === 'subtract') {
    if(isNaN(amount)) return message.send(`❌ \`|\` 🏦 \`${amount}\` **is not a number!**`);
    amount = +amount;

    const newBalance = await user.changeBalance('add', amount);
    if (!newBalance) return message.send(`:x: \`|\` :bank: \`${user.tag}\`**'s balance is below zero! Actions cannot be performed.**`);
    message.send(`✅ \`|\` 🏦 **Successfully subtracted** \`${amount}\` **from** \`${user.tag}\`**.** New balance: \`${newBalance}\`.`);
  }

  if(type === 'set') {
    if(isNaN(amount)) return message.send(`❌ \`|\` 🏦 \`${amount}\` **is not a number!**`);
    amount = +amount;

    const newBalance = await user.changeBalance('add', amount);
    if (!newBalance) return message.send(`:x: \`|\` :bank: \`${user.tag}\`**'s balance is below zero! Actions cannot be performed.**`);
    message.send(`✅ \`|\` 🏦 **Successfully set** \`${user.tag}\`**'s new balance to** \`${newBalance}\`**.**`);
  }

  if(type === 'get') {
    message.send(`:bank: \`${user.tag}\`**'s balance is** ${await user.balance}**.**`);
  }
};

exports.conf = {
  enabled: true,
  aliases: ['economy'],
  guildOnly: false,
  permLevel: 'Bot Admin'
};

exports.help = {
  name: 'eco',
  description: 'Manage the bot\'s economy',
  usage: 'eco <add/remove/set/get> <amount> [user]',
  category: 'Economy'
};