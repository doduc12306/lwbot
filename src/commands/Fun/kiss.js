const Discord = require('discord.js');
exports.run = (client, message) => {
  const giphy = require('giphy-api')(process.env.GIPHY);

  giphy.random({
    tag: 'kiss sexy kissing hot makeout anime',
    limit: 1,
    rating: 'pg',
    fmt: 'json'
  }).then(function(res) {
    const myArray = ['snogging', 'sucking face', 'getting intimate', 'kissing', 'in a loving embrace'];
    const words = myArray[Math.floor(Math.random() * myArray.length)];

    message.send(new Discord.RichEmbed()
      .setTitle(`${message.author.tag} and ${message.mentions.members.first().displayName} are ${words}, give em a bit of privacy!`)
      .setImage(res.data.image_url)
      .setColor('0xef6969')
    );
  });
};

exports.conf = {
  enabled: false,
  guildOnly: true,
  aliases: ['makeout'],
  permLevel: 'User',
  requiresEmbed: true
};

exports.help = {
  name: 'kiss',
  description: 'Kiss someone',
  usage: 'kiss <user>',
  category: 'Fun'
};