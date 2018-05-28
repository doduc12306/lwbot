const Discord = require(`discord.js`);
exports.run = (client, message) => {
  var giphy = require(`giphy-api`)(client.config.giphy);
  
  giphy.random({
    tag: `kiss sexy kissing hot makeout anime`,
    limit: 1,
    rating: `pg`,
    fmt: `json`
  }).then(function(res) {
    var myArray = [`snogging`, `sucking face`, `getting intimate`, `kissing`, `in a loving embrace`];
    var words = myArray[Math.floor(Math.random() * myArray.length)];
        
    message.channel.send(new Discord.RichEmbed()
      .setTitle(`${message.author.tag} and ${message.mentions.users.first()} are ${words}, give em a bit of privacy!`)
      .setImage(res.data.image_url)
    );
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [`makeout`],
  permLevel: `User`
};

exports.help = {
  name: `kiss`,
  description: `Kiss someone`,
  usage: `kiss <user>`,
  category: `Fun`
};