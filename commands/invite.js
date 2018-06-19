const Discord = require(`discord.js`);
module.exports.run = (client, message, args) => { // eslint-disable-line no-unused-vars
  client.users.get(client.conf.ownerID).send(new Discord.RichEmbed().setTitle(`Invite me to another server!`).setDescription(`https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`).setColor(`0x59D851`));
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: `Bot Owner`,
  guildOnly: false
};

exports.help = {
  name: `invite`,
  description: `Invite the bot to another server`,
  usage: `invite`,
  category: `System`
};