const ud = require('urban-dictionary');
const Discord = require('discord.js');

module.exports.run = (client, message, args) => {
  var definition = args.join(' ');

  if (!definition) return message.channel.send(':x: You forgot a word to look up!');

  ud.term(definition, function(error, entries) {
    if (error) {
      if (error) message.channel.send(`:x: I couldn't find ${definition}`);
    } else {
      message.channel.send(new Discord.RichEmbed()
        .addField(entries[0].word, entries[0].definition, true)
        .addField('Example:', `*${entries[0].example}*`)
        .setColor(client.config.colors.green)
      );
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ud', 'urbandictionary'],
  permLevel: 'User'
};

exports.help = {
  name: 'urban',
  description: 'Search for a word in the Urban Dictionary',
  usage: 'urban <word>',
  category: 'Fun'
};