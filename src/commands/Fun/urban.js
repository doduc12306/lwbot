const fetch = require('node-fetch');
const Discord = require('discord.js');
module.exports.run = (client, message, args) => {
  const word = args.join(' ');

  if (!word) return message.send('❌ **You forgot a word to look up!**');

  fetch(`http://api.urbandictionary.com/v0/define?term=${word}`).then(data => data.json()).then(data => {
    data = data.list[0];

    if(data === undefined) return message.send(`❌ **I couldn't find ${clean(word)}**`);

    let definition;
    definition = data.definition.length <= 2048 ? definition = data.definition : definition = data.definition.substring(0, 2044) + '...';

    message.send(new Discord.MessageEmbed()
      .setTitle(data.word)
      .setDescription(clean(definition))
      .setColor(client.accentColor)
      .addField('Example', clean(data.example))
      .setTimestamp(data.written_on)
      .setFooter(`👍 ${data.thumbs_up} | 👎 ${data.thumbs_down}`)
      .setURL(data.permalink)
    );
  });

  function clean(text) {
    return text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(/\[(.*?)\]/gi, match => match.substring(1, match.length - 1));
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ud', 'urbandictionary', 'urnab'],
  permLevel: 'User',
  requiresEmbed: true
};

exports.help = {
  name: 'urban',
  description: 'Search for a word in the Urban Dictionary',
  usage: 'urban <word>',
  category: 'Fun'
};