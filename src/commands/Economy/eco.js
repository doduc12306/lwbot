//var { bank } = require('../modules/functions');

module.exports.run = async (client, message, args) => {
  const type = args[0];
  if(!['add', 'subtract', 'set', 'get'].includes(type)) return message.send(':x: | :bank: **Please say what you would like to do:** `add` `subtract` `set` `get`');

  const user = message.mentions.users.first() ? message.mentions.users.first() : message.author;
  let amount = args[1];

  if(type === 'add') {
    if(isNaN(amount)) return message.send(`:x: \`|\` :bank: \`${amount}\` **is not a number!**`);
    amount = parseInt(amount);

    client.bank.add(user.id, amount);
    await client.bank.sync();
    client.bank.get(user.id).then(balance => message.send(`:white_check_mark: \`|\` :bank: **Successfully added** \`${amount}\` **to** \`${user.tag}\`**.** New balance: \`${balance}\`.`));
  }

  if(type === 'subtract') {
    if(isNaN(amount)) return message.send(`:x: \`|\` :bank: \`${amount}\` **is not a number!**`);
    amount = parseInt(amount);

    client.bank.subtract(user.id, amount);
    await client.bank.sync();
    client.bank.get(user.id).then(balance => message.send(`:white_check_mark: \`|\` :bank: **Successfully subtracted** \`${amount}\` **from** \`${user.tag}\`**'s balance.** New balance: \`${balance}\`. `));
  }

  if(type === 'set') {
    if(isNaN(amount)) return message.send(`:x: \`|\` :bank: \`${amount}\` **is not a number!**`);
    amount = parseInt(amount);

    client.bank.set(user.id, amount);
    await client.bank.sync();
    client.bank.get(user.id).then(balance => message.send(`:white_check_mark: \`|\` :bank: **Successfully set** \`${user.tag}\`**'s balance to** \`${balance}\`**.**`));
  }

  if(type === 'get') {
    client.bank.get(user.id).then(balance => message.send(`:information_source: \`|\` :bank: **Balance of** \`${user.tag}\`**:** \`${balance}\`.`));
  }
};

exports.conf = {
  enabled: false,
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