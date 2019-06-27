const { get } = require('snekfetch');
const Discord = require('discord.js');
module.exports.run = (client, message, args) => {
  const word = args.join(' ');

  if (!word) return message.send('❌ You forgot a word to look up!');

  get(`http://api.urbandictionary.com/v0/define?term=${word}`).then(data => {
    data = JSON.parse(data.text).list[0];

    if(data === undefined) return message.send(`❌ **I couldn't find ${clean(word)}**`);

    let definition;
    definition = data.definition.length <= 1024 ? definition = data.definition : definition = data.definition.substring(0, 1020) + '...';

    message.send(new Discord.RichEmbed()
      .setColor(client.config.colors.accentColor)
      .addField(data.word, clean(definition))
      .addField('Example', `*${clean(data.example)}*`)
      .setTimestamp(data.written_on)
      .setFooter(`👍 ${data.thumbs_up} | 👎 ${data.thumbs_down}`)
    );
  });

  function clean(text) {
    return text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(/\[(\S+)\]/gi, match => match.substring(1, match.length - 1));
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ud', 'urbandictionary'],
  permLevel: 'User',
  requiresEmbed: true
};

exports.help = {
  name: 'urban',
  description: 'Search for a word in the Urban Dictionary',
  usage: 'urban <word>',
  category: 'Fun'
};