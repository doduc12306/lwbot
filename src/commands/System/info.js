const Discord = require('discord.js');

module.exports.run = (client, message) => {
  message.send(new Discord.RichEmbed()
    .setColor('0x59D851')
    .setAuthor('LINE WEBTOON', client.user.avatarURL)
    .setThumbnail(client.user.avatarURL)
    .addField('Version', require('../../../package.json').version, true)
    .addField('Library', '[Discord.js](http://discord.js.org/)', true)
    .addField('Repository', '[Gitlab - lwbot-rewrite](http://gitlab.com/akii0008/lwbot-rewrite)', true)
    .addField('Creator', `<@107599228900999168> (${client.users.get('107599228900999168').tag})`, true)
    .addField('Special Thanks', '[`An Idiot\'s Guide`](http://anidiots.guide/) - Initial command framework, eval command, reload command, and so many other things. Thank you *so* much.\n[`discordjs.guide`](http://discordjs.guide) - Provided tagging system.\n[`Discord.js Server`](https://discord.gg/bRCvFy9) - You guys answered every question the docs couldn\'t.')
  );
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['botinfo'],
  permLevel: 'User',
  requiresEmbed: true
};

exports.help = {
  name: 'info',
  description: 'Shows information of the bot',
  category: 'System',
  usage: 'info'
};
