const { RichEmbed } = require('discord.js');
module.exports.run = (client, message, args) => {
  const GuildSettings = require('../../dbFunctions/message/settings');
  const settings = new GuildSettings(message.guild.id);
  if (!message.guild.me.permissionsIn(message.channel).serialize()['MANAGE_ROLES']) return message.send('❌ `|` 🔓 **I am missing permission!** `Manage Roles`');
  if (!message.member.permissionsIn(message.channel).serialize()['MANAGE_MESSAGES'] ||
    !message.member.permissionsIn(message.channel).serialize()['MANAGE_CHANNELS']) return message.send('❌ `|` 🔓 **You are missing permissions!** `Manage Messages` or `Manage Channel`');

  const crgx = /<#([0-9]+)>/g;
  let channel = undefined;
  let reason = undefined;
  let forcemode = false;

  try {
    if (crgx.test(args[0])) {
      channel = message.functions.parseChannel(args[0]);

      if (args[1]) reason = args.splice(1).join(' ');
    } else {
      channel = message.channel;
      if (args[0]) reason = args.join(' ');
    }
  } catch (e) {
    if (e.message === 'Channel does not exist') return message.send('❌ `|` 🔓 **Channel does not exist.**');
  }

  if (reason && reason.endsWith('-f')) { forcemode = true; reason = reason.split(/-f$/gi)[0]; }

  if (channel.permissionsFor(message.guild.id).has('SEND_MESSAGES') && !forcemode) return message.send('❌ `|` 🔓 **This channel is already unlocked.**\nIf you believe this is an error, edit your command and put `-f` (force mode) at the end.');

  for (let overwrite of channel.permissionOverwrites) {
    overwrite = overwrite[1];
    if (overwrite.type === 'role' && message.guild.roles.get(overwrite.id).name.toLowerCase() === 'muted') continue;
    channel.overwritePermissions(overwrite.id, { SEND_MESSAGES: true });
  }

  const modEmbed = new RichEmbed()
    .setColor(client.accentColor)
    .addField('Unlock Channel', `${channel.toString()} (#${channel.name})`)
    .addField('Moderator', `${message.author.toString()} (${message.author.tag})`)
    .setThumbnail(message.author.displayAvatarURL);

  if (reason) modEmbed.addField('Reason', reason);

  settings.get('modLogChannel')
    .then(async modLogChannel => {
      modLogChannel = message.guild.channels.find(g => g.name.toLowerCase() === modLogChannel.toLowerCase());
      if (!message.guild.me.permissionsIn(modLogChannel).serialize()['SEND_MESSAGES'] || !message.guild.me.permissionsIn(modLogChannel).serialize()['EMBED_LINKS']) {
        modLogChannel.overwritePermissions(client.user, { SEND_MESSAGES: true, EMBED_LINKS: true }).catch(() => { return message.send(`⚠️ **Channel unlocked, but I errored:**\nI tried to give myself permissions to send messages or post embeds in ${modLogChannel}, but I couldn't. Please make sure I have the \`Manage Roles\` permission, as that allows me to.`); });
      }
      await modLogChannel.send(modEmbed);
      await message.send('✅ `|` 🔓 **Unlocked channel.**');
    })
    .catch(async e => message.send(`❌ **Channel unlocked, but I couldn't send to the modlog channel:** \`${e.stack}\``));
};

exports.conf = {
  enabled: true,
  aliases: ['unlockchannel'],
  permLevel: 'Moderator',
  guildOnly: true
};

exports.help = {
  name: 'unlock',
  description: 'Unlock a locked channel',
  usage: 'unlock [#channel] [reason]',
  category: 'Moderation'
};