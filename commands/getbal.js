module.exports.run = (client, message) => client.bank.get(message.author.id || message.mentions.users.first().id).then(bal => message.channel.send(`:information_source: \`|\` ${message.author.tag || message.mentions.users.first().tag}**'s balance is** \`${bal}\`**.**`));

exports.conf = {
  enabled: false,
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