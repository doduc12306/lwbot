const parse = require('parse-duration');
const { RichEmbed } = require('discord.js');
const moment = require('moment');
module.exports.run = (client, message, args) => {
  if (!message.guild.me.permissionsIn(message.channel).serialize()['MANAGE_ROLES']) return message.send('❌ `|` 🔒 **I am missing permissions!** `Manage Roles`'); // Manage roles, oddly enough, lets the bot edit channel perms.
  if (!message.member.permissionsIn(message.channel).serialize()['MANAGE_CHANNELS'] ||
    !message.member.permissionsIn(message.channel).serialize()['MANAGE_MESSAGES']) return message.send('❌ `|` 🔒 **You are missing permissions!** `Manage Channels` or `Manage Messages`');

  let channel = undefined;
  let duration = undefined;
  let reason = undefined;

  const crgx = /<#([0-9]+)>/g;

  let forcemode = false;

  /* Logic of how the arguments are parsed */
  try { // try catch because .parseChannel throws errors instead of rejecting.

    if (crgx.test(args[0])) {
      channel = message.functions.parseChannel(args[0]);

      if (args[1] && parse(args[1]) !== 0) {
        duration = args[1];

        if (args[2]) reason = args.splice(2).join(' ');
      } else {
        if (args[1]) reason = args.splice(1).join(' ');
      }
    } else {
      channel = message.channel;

      if (args[0] && parse(args[0]) !== 0) {
        duration = args[0];

        if (args[1]) reason = args.splice(1).join(' ');
      } else {
        if (args[0]) reason = args.join(' ');
      }
    }

  } catch (e) {
    if (e.message === 'Channel does not exist') return message.send('❌ `|` 🔒 **Channel does not exist.**');
    else if (e.message === 'You didn\'t give me anything to find a channel from!') { /* Ignore error */ }
    else return client.logger.error(e);
  }
  /* End logic */

  if(reason && reason.endsWith('-f')) { forcemode = true; reason = reason.split(/-f$/gi)[0]; }
  if(!channel.permissionsFor(message.guild.id).has('SEND_MESSAGES') && !forcemode) return message.send('❌ `|` 🔒 **This channel is already locked.**\nIf you believe this is an error, edit your command and put `-f` (force mode) at the end.');

  channel.permissionOverwrites.forEach(overwrite => {
    channel.overwritePermissions(overwrite.id, { SEND_MESSAGES: false }, reason ? `Channel lock | ${reason}` : 'Channel lock');
  });
  channel.overwritePermissions(message.guild.id, { SEND_MESSAGES: false }, reason ? `Channel lock | ${reason}` : 'Channel lock');

  const modEmbed = new RichEmbed()
    .setColor(client.config.colors.red)
    .addField('Lock Channel', `${channel.toString()} (#${channel.name})`)
    .addField('Moderator', `${message.author.toString()} (${message.author.tag})`)
    .setThumbnail(message.author.avatarURL);

  let durationMs;
  let durationHR;
  if(duration) {
    durationMs = parse(duration);
    durationHR = moment.duration(durationMs).format('M [months] W [weeks] D [days], H [hrs], m [mins], s [secs]'); // HR = "Human Readable"
    modEmbed.addField('Duration', durationHR);
  }

  if (reason) modEmbed.addField('Reason', reason);

  message.guild.settings.get('modLogChannel')
    .then(async modLogChannel => {
      modLogChannel = message.guild.channels.find(g => g.name.toLowerCase() === modLogChannel.toLowerCase());
      if (!modLogChannel) return message.send(`⚠️ **Lock completed, but there is no mod log channel set.** Try \`${await message.guild.settings.get('prefix')}set <edit/add> modLogChannel <channel name>\``);
      if (!message.guild.me.permissionsIn(modLogChannel).serialize()['SEND_MESSAGES'] || !message.guild.me.permissionsIn(modLogChannel).serialize()['EMBED_LINKS']) {
        modLogChannel.overwritePermissions(client.user, { SEND_MESSAGES: true, EMBED_LINKS: true }).catch(() => { return message.send(`⚠️ **Lock completed, but I errored:**\nI tried to give myself permissions to send messages or post embeds in ${modLogChannel}, but I couldn't. Please make sure I have the \`Manage Roles\` permission, as that allows me to.`); });
      }
      await modLogChannel.send(modEmbed);
      await message.send('✅ `|` 🔒 **Locked channel**');
    })
    .catch(async e => message.send(`❌ **There was an error finding the mod log channel:** \`${e.stack}\``));

  if (duration) {
    setTimeout(() => {

      channel.overwritePermissions(message.guild.id, { SEND_MESSAGES: true }, reason ? `Channel auto-unlock | ${reason}` : 'Channel auto-unlock');
      channel.permissionOverwrites.forEach(overwrite => {
        if (overwrite.type === 'role' && message.guild.roles.get(overwrite.id).name.toLowerCase() === 'muted') return;
        channel.overwritePermissions(overwrite.id, { SEND_MESSAGES: true }, reason ? `Channel auto-unlock | ${reason}` : 'Channel auto-unlock');
      });

      const modEmbedTO = new RichEmbed()
        .setColor(client.config.colors.green)
        .addField('Unlock Channel', `${channel.toString()} (#${channel.name})`, true)
        .addField('Moderator', `${client.user.toString()} (${client.user.tag})`, true)
        .setThumbnail(client.user.avatarURL);

      if (duration) modEmbed.addField('Duration', durationHR, true);
      modEmbed.addField('Reason', reason ? `Auto-unlock | ${reason}` : 'Auto-unlock');

      message.guild.settings.get('modLogChannel')
        .then(async modLogChannel => {
          modLogChannel = message.guild.channels.find(g => g.name.toLowerCase() === modLogChannel.toLowerCase());
          if (!message.guild.me.permissionsIn(modLogChannel).serialize()['SEND_MESSAGES'] || !message.guild.me.permissionsIn(modLogChannel).serialize()['EMBED_LINKS']) {
            modLogChannel.overwritePermissions(client.user, { SEND_MESSAGES: true, EMBED_LINKS: true }).catch(() => { return message.send(`⚠️ **Channel lock completed, but I errored:**\nI tried to give myself permissions to send messages or post embeds in ${modLogChannel}, but I couldn't. Please make sure I have the \`Manage Roles\` permission, as that allows me to.`); });
          }
          await modLogChannel.send(modEmbedTO);
          await message.send('✅ `|` 🔓 **Unlocked channel.** [Timeout]');
        })
        .catch(async e => message.send(`❌ **Channel unlocked, but I couldn't send to the modlog channel:** \`${e.stack}\``));

    }, durationMs);
  }
};

exports.conf = {
  enabled: true,
  permLevel: 'Moderator',
  aliases: ['lockchannel'],
  guildOnly: true
};

exports.help = {
  name: 'lock',
  description: 'Prevent people from speaking in a channel',
  usage: 'lock [#channel] [duration] [reason]',
  category: 'Moderation'
};