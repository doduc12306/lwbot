const Discord = require(`discord.js`);

module.exports.run = (client, message, args) => {message.react(`✅`); message.author.send(`Just go to https://gitlab.com/akii0008/modmail-bot and read the README.md to learn how!`);};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: `Administrator`
};

exports.help = {
  name: `modmail`,
  description: `A guide on how to set up your own modmail bot`,
  usage: `modmail`,
  category: `Server`
};