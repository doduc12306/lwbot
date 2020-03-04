const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
  try {
    const settings = client.settings.get(message.guild.id);

    //if ( message.member.permissions.has(`MANAGE_MESSAGES`) || message.author.id === `107599228900999168`) {

    String.prototype.replaceAll = function (search, replacement) {
      const target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
    };

    const messageContent = args.join(' ');
    const splitter = messageContent.split(' | ');
    const title = splitter[0];
    const part2 = splitter[1];
    const cmdargs = splitter[2];

    if (!title) return message.send('❌ **Missing a title!**');
    if (!part2) return message.send('❌ **Missing the content!**');
    const content = part2.replaceAll('/n', '\n').trim();

    let color = client.accentColor;
    if (cmdargs) {
      if (cmdargs.includes('color=')) { color = cmdargs.substring(cmdargs.indexOf('color=') + 6); } else { color = client.accentColor; }
    } else { color = client.accentColor; announce(); }

    function announce() { // eslint-disable-line no-inner-declarations
      message.guild.channels.find(channel => channel.name === settings.announcementsChannel).send(new Discord.MessageEmbed()
        .setColor(color)
        .setAuthor(message.author.username, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
        .setTimestamp()
        .addField(title, content)
      );
      if (cmdargs) message.send(`✅ **Announcement sent!** | **Args:** \`${cmdargs}\``);
      else message.send('✅ **Announcement sent!**');
    }
    // } else message.send(`❌ You do not have access to this command!`);
  } catch (err) { message.send(`❌ ${err}`); }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  permLevel: 'Moderator',
  aliases: ['anno'],
  requiresEmbed: true
};

exports.help = {
  name: 'announce',
  description: 'Announces something',
  usage: 'announce <title> | <content> [| arguments]\nARGUMENTS: `color=<#hex | base10>` Sets sidebar color, `no-subs` Disables ping of guild\'s announcements subscribers role',
  category: 'Server'
};