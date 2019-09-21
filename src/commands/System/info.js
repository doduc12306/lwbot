const Discord = require('discord.js');
const package = require('../../../package.json');

module.exports.run = (client, message) => {
  message.send(new Discord.RichEmbed()
    .setColor(client.accentColor)
    .setAuthor('LINE WEBTOON', client.user.displayAvatarURL)
    .setThumbnail(client.user.displayAvatarURL)
    .addField('Version', `v${package.version}`, true)
    .addField('Library', `[Discord.js](http://discord.js.org/) (v${package.dependencies['discord.js']})`, true)
    .addField('Repository', '[Gitlab - lwbot-rewrite](http://gitlab.com/akii0008/lwbot-rewrite)', true)
    .addField('Creator', `<@107599228900999168> (${client.users.get('107599228900999168').tag})`, true)
    .addField('Credits', '[`An Idiot\'s Guide`](http://anidiots.guide/) - Initial command framework, which I then modified heavily.\n[`discordjs.guide`](http://discordjs.guide) - Provided tagging system.\n[`Discord.js Server`](https://discord.gg/bRCvFy9) - You guys answered every question the docs couldn\'t.\n**All my volunteer testers** - Couldn\'t have done this without you. Thank you for letting me repeatedly ban you.')
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
