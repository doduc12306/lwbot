const fetch = require('node-fetch');
const { RichEmbed } = require('discord.js');
module.exports.run = (client, message, args) => {
  const search = args[0];

  if (!search) { // Get the latest xkcd comic
    fetch('https://xkcd.com/info.0.json')
      .then(async res =>{
        const json = await res.json();
        displayXKCD(json);
      });
  } else {
    if (isNaN(search)) return message.send(`:x: \`|\` :mag: \`${search}\` **is not a number!**`);
    fetch(`https://xkcd.com/${search}/info.0.json`)
      .then(async res => {
        if (!res.ok) return message.send(`:x: \`|\` :mag: **XKCD **\`#${search}\` **does not exist.**`);
        const json = await res.json();
        displayXKCD(json, +search);
      });
  }

  function displayXKCD(json, number) {
    const embed = new RichEmbed()
      .setColor('#FFFFFF')
      .setTitle(json.safe_title)
      .setDescription(json.alt)
      .setImage(json.img)
      .setFooter(`#${json.num} • ${json.month}/${json.day}/${json.year}`)
      .setAuthor('xkcd', 'https://i.imgur.com/XcDZksp.png', `https://xkcd.com/${number ? json.num : ''}`);

    message.send(embed).then(async msg => {
      await msg.react('◀');
      await msg.react('🛑');
      await msg.react('▶');

      const filter = (reaction, user) => ['◀', '🛑', '▶'].includes(reaction.emoji.name) && user.id === message.author.id;
      const collector = msg.createReactionCollector(filter, { time: 120000 })
        .on('collect', async g => {
          if (g._emoji.name === '🛑') return collector.emit('end');
          else if (g._emoji.name === '◀') {
            if (number === 1) return msg.reactions.get('◀').remove(message.author);
            msg.reactions.get('◀').remove(message.author);
            number--;
            fetch(`https://xkcd.com/${+number}/info.0.json`)
              .then(async res => {
                if (!res.ok) return msg.edit(`:x: \`|\` :mag: **XKCD **\`#${number}\` **does not exist.**`);
                const json = await res.json();
                msg.edit(new RichEmbed()
                  .setColor('#FFFFFF')
                  .setTitle(json.safe_title)
                  .setDescription(json.alt)
                  .setImage(json.img)
                  .setFooter(`#${json.num} • ${json.month}/${json.day}/${json.year}`)
                  .setAuthor('xkcd', 'https://i.imgur.com/XcDZksp.png', `https://xkcd.com/${json.num}`));
              });

          } else if (g._emoji.name === '▶') {
            msg.reactions.get('▶').remove(message.author);
            number++;
            fetch(`https://xkcd.com/${+number}/info.0.json`)
              .then(async res => {
                if (!res.ok) return msg.edit(`:x: \`|\` :mag: **XKCD **\`#${number}\` **does not exist.**`);
                const json = await res.json();
                msg.edit(new RichEmbed()
                  .setColor('#FFFFFF')
                  .setTitle(json.safe_title)
                  .setDescription(json.alt)
                  .setImage(json.img)
                  .setFooter(`#${json.num} • ${json.month}/${json.day}/${json.year}`)
                  .setAuthor('xkcd', 'https://i.imgur.com/XcDZksp.png', `https://xkcd.com/${json.num}`));
              });
          } else msg.reactions.get(g._emoji.name).remove(message.author);

        })
        .on('end', () => msg.clearReactions());
    });
  }
};

exports.conf = {
  enabled: true,
  permLevel: 'User',
  guildOnly: false,
  aliases: [],
  requiresEmbed: true
};

exports.help = {
  name: 'xkcd',
  description: 'Find an XKCD',
  usage: 'xkcd [#]',
  category: 'Comics'
};