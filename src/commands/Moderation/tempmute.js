const Discord = require('discord.js');
const parse = require('parse-duration');
const moment = require('moment');
require('moment-duration-format');

module.exports.run = async (client, message, args) => {
  const GuildSettings = require('../../dbFunctions/message/settings');
  const settings = new GuildSettings(message.guild.id);
  const role = message.guild.roles.find(role => role.name === 'Muted') || message.guild.roles.find(role => role.name === 'muted');
  const toMute = message.mentions.members.first();
  const reason = args.slice(2).join(' ');
  const mutedEmote = '<:muted:459458717856038943>';

  const duration = args[1];
  if(!duration) return message.send(`:x: \`|\` ${mutedEmote} **You didn't give a duration to mute!**`);
  const durationMs = parse(duration);
  const durationHR = moment.duration(durationMs).format('M [months] W [weeks] D [days], H [hrs], m [mins], s [secs]'); // HR = "Human Readable"

  if (!message.guild.me.permissions.has('MANAGE_ROLES')) return message.send(`❌ \`|\` ${mutedEmote} **I am missing permissions: \`Manage Roles\``);
  if (!toMute) return message.send(`❌ \`|\` ${mutedEmote} **You didn't mention someone to mute!**`);
  if (toMute.permissions.has('ADMINISTRATOR')) return message.send(`❌ \`|\` ${mutedEmote} **${toMute.toString()} could not be muted because they have Administrator!`);
  if (message.guild.me.roles.highest.position < toMute.roles.highest.position) return message.send(`❌ \`|\` ${mutedEmote} **You need to move my role (${message.guild.me.roles.highest.name}) above ${toMute.toString()}'s (${toMute.roles.highest.name})!**`);
  if (toMute.roles.has(role.id)) return message.send(`❌ \`|\` ${mutedEmote} **${toMute.toString()} is already muted!**`);

  await message.guild.modbase.create({
    victim: toMute.id,
    moderator: message.author.id,
    type: 'tempmute',
    duration: durationMs
  }).then(async info => {
    let dmMsg = `${mutedEmote} **You were tempmuted in** \`${message.guild.name}\` **for** \`${durationHR}\` \`|\` 👤 **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;

    let modEmbed = new Discord.MessageEmbed()
      .setTitle('Temporarily Muted Member')
      .setThumbnail(toMute.user.displayAvatarURL({ format: 'png', dynamic: true }))
      .setColor(client.config.colors.purple)
      .setFooter(`ID: ${toMute.user.id} | Case: ${info.id}`)
      .addField('Muted Member', `${toMute.user.toString()} (${toMute.user.tag})`)
      .addField('Moderator', `${message.author.toString()} (${message.author.tag})`)
      .addField('Duration', durationHR);

    if (reason) { dmMsg += `\n\n⚙️ **Reason \`${reason}\`**`; modEmbed.addField('Reason', reason); message.guild.modbase.update({ reason: reason }, { where: { id: info.id } }); }

    toMute.user.send(dmMsg);
    toMute.roles.add(role, reason ? `Tempmute | ${reason}` : null);
    await settings.get('modLogChannel')
      .then(async modLogChannel => {
        modLogChannel = message.guild.channels.cache.find(g => g.name.toLowerCase() === modLogChannel.toLowerCase());
        if (!modLogChannel) return message.send(`⚠️ **Tempmute issued, but there is no mod log channel set.** Try \`${await settings.get('prefix')}set <edit/add> modLogChannel <channel name>\``);
        if (!message.guild.me.permissionsIn(modLogChannel).serialize()['SEND_MESSAGES'] || !message.guild.me.permissionsIn(modLogChannel).serialize()['EMBED_LINKS']) {
          modLogChannel.createOverwrite(client.user, { SEND_MESSAGES: true, EMBED_LINKS: true }).catch(() => { return message.send(`⚠️ **Tempmute issued, but I errored:**\nI tried to give myself permissions to send messages or post embeds in ${modLogChannel}, but I couldn't. Please make sure I have the \`Manage Roles\` permission, as that allows me to.`); });
        }
        await modLogChannel.send(modEmbed);
        await message.send(`✅ \`|\` ${mutedEmote} **Tempmuted user \`${toMute.user.tag}\`**`);
      })
      .catch(async e => message.send(`❌ **There was an error finding the mod log channel:** \`${e.stack}\``));

    setTimeout(async () => {
      await message.guild.modbase.create({
        victim: toMute.id,
        moderator: client.user.id,
        type: 'tempmute unmute',
      }).then(async info => {
        modEmbed = new Discord.MessageEmbed()
          .setThumbnail(toMute.user.displayAvatarURL({ format: 'png', dynamic: true }))
          .setColor(client.accentColor)
          .setAuthor(`Unmuted ${toMute.user.tag} (${toMute.id})`)
          .setFooter(`ID: ${toMute.id} | Case: ${info.id}`)
          .addField('User', `${toMute.toString()} (${toMute.user.tag})`)
          .addField('Moderator', `${client.user.toString()} (${client.user.tag})`);

        if (!reason) { message.guild.modbase.update({ reason: 'Tempmute auto unmute' }, { where: { id: info.id } }); await modEmbed.addField('Reason', 'Tempmute auto unmute'); }
        else { message.guild.modbase.update({ reason: `${reason} | Tempmute auto unmute` }, { where: { id: info.id } }); await modEmbed.addField('Reason', `${reason} | Tempmute auto unmute`); }

        toMute.roles.remove(role, reason ? `Tempmute unmute | ${reason}`: null);
        await settings.get('modLogChannel')
          .then(async modLogChannel => {
            modLogChannel = message.guild.channels.cache.find(g => g.name.toLowerCase() === modLogChannel.toLowerCase());
            if (!modLogChannel) return message.send(`⚠️ **A tempmute has completed, but there is no mod log channel set.** Try \`${await settings.get('prefix')}set <edit/add> modLogChannel <channel name>\``);
            if (!message.guild.me.permissionsIn(modLogChannel).serialize()['SEND_MESSAGES'] || !message.guild.me.permissionsIn(modLogChannel).serialize()['EMBED_LINKS']) {
              modLogChannel.createOverwrite(client.user, { SEND_MESSAGES: true, EMBED_LINKS: true }).catch(() => { return message.send(`⚠️ **A tempmute has completed, but I errored:**\n I tried to give myself permissions to send messages or post embeds in ${modLogChannel}, but I couldn't. Please make sure I have the \`Manage Roles\` permission, as that allows me to.`); });
            }
            await modLogChannel.send(modEmbed);
          })
          .catch(async e => message.send(`❌ **There was an error finding the mod log channel:** \`${e.stack}\``));
      });
    }, durationMs);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'Moderator'
};

exports.help = {
  name: 'tempmute',
  description: 'Temporarily mute a user',
  usage: 'tempmute <@user> <duration> [reason]\nDuration example: "1y2w8d4h5m10s" -> 1 year 2 weeks 8 days etc long',
  category: 'Moderation'
};