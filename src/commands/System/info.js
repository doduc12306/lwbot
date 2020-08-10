const Discord = require('discord.js');
const package = require('../../../package.json');
const GuildEvents = require('../../dbFunctions/message/events');

module.exports.run = async (client, message, args) => {
  switch (args[0]) {
    case 'privacypolicy':
    case 'privacy': {
      let messageToSend = `ℹ️ **The Privacy Policy:**\n\n**Simply, your data is not collected nor sold**, with the exception of command usage (which is just collected, not sold, and never will be sold). The **ONLY** data that is collected is command usage, which is anonymous, and can be opted out of by running the command \`${message.guild.settings['prefix']}cmdstats opt-out\`. The reason this data is collected is because I, the developer of this bot, am curious as to what commands are being used and how often, so I know where to focus my attention and effort.`;

      const guildEvents = new GuildEvents(message.guild.id);
      const messageUpdate = await guildEvents.get('messageUpdate');
      const messageDelete = await guildEvents.get('messageDelete');
      if(messageUpdate || messageDelete) {
        messageToSend += '\n\n**However**, from the configuration of this server\'s settings on this bot, it looks like **some data,** such as the contents of edited messages and/or the contents of deleted messages, is being logged. This is to a channel that this bot does not control; this server\'s staff does (most likely). **If you would like your data deleted from that channel, contact your server staff, and tell them to delete the messages that contain your data.**';
      }

      message.send(messageToSend);
      break;
    }

    case 'failover': {
      message.send(`ℹ️ **Failover mode** is initiated when the main bot has gone offline, for any reason. Think of failover mode as a backup bot; it's the same bot but with reduced features (e.g. certain commands that have been known to cause issues are disabled).\n\n${global.failover ? ':warning: Unfortuantely, the bot **is** currently in failover mode.' : ':white_check_mark: Fortunately, the bot **is not** currently in failover mode. Everything works :)'}`);
      break;
    }

    default: {
      message.send(new Discord.MessageEmbed()
        .setColor(client.accentColor)
        .setAuthor('LINE WEBTOON', client.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .addField('Version', `v${package.version}`, true)
        .addField('Library', `[Discord.js](http://discord.js.org/) (v${clean(package.dependencies['discord.js'])})`, true)
        .addField('Repository', '[Gitlab - lwbot-rewrite](http://gitlab.com/akii0008/lwbot-rewrite)', true)
        .addField('Creator', `<@107599228900999168> (${client.users.cache.get('107599228900999168').tag})`, true)
        .addField('Credits', '[`An Idiot\'s Guide`](http://anidiots.guide/) - Initial command framework, which I then modified heavily.\n[`discordjs.guide`](http://discordjs.guide) - Provided tagging system.\n[`Discord.js Server`](https://discord.gg/bRCvFy9) - You guys answered every question the docs couldn\'t.\n**All my volunteer testers** - Couldn\'t have done this without you. Thank you for letting me repeatedly ban you.')
      );
      break;
    }
  }
};

function clean(str) {
  str = str.replace(/^(?:\^|@)/g, '');
  return str;
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['botinfo', 'about'],
  permLevel: 'User',
  requiresEmbed: true
};

exports.help = {
  name: 'info',
  description: 'Shows information of the bot',
  category: 'System',
  usage: 'info [failover / privacy]'
};
