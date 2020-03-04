const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const GuildSettings = require('../../dbFunctions/message/settings');
  const settings = new GuildSettings(message.guild.id);
  const role = message.guild.roles.find(role => role.name === 'Muted') || message.guild.roles.find(role => role.name === 'muted');
  const toMute = message.mentions.members.first();
  const reason = args.slice(1).join(' ');
  const mutedEmote = '<:muted:459458717856038943>';

  if (!message.guild.me.permissions.has('MANAGE_ROLES')) return message.send(`❌ \`|\` ${mutedEmote} **I am missing permissions: \`Manage Roles\`**`);
  if (!toMute) return message.send(`❌ \`|\` ${mutedEmote} **You didn't mention someone to mute!**`);
  if (toMute.permissions.has('ADMINISTRATOR')) return message.send(`❌ \`|\` ${mutedEmote} **${toMute.toString()} could not be muted because they have Administrator!**`);
  if (message.guild.me.roles.highest.position < toMute.roles.highest.position) return message.send(`❌ \`|\` ${mutedEmote} **You need to move my role (${message.guild.me.roles.highest.name}) above ${toMute.toString()}'s (${toMute.roles.highest.name})!**`);
  if (toMute.roles.has(role.id)) return message.send(`❌ \`|\` ${mutedEmote} **${toMute.toString()} is already muted!**`);

  await message.guild.modbase.create({
    victim: toMute.id,
    moderator: message.author.id,
    type: 'mute'
  }).then(async info => {
    let dmMsg = `${mutedEmote} **You were muted in** \`${message.guild.name}\` \`|\` 👤 **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;

    const modEmbed = new Discord.MessageEmbed()
      .setThumbnail(toMute.user.displayAvatarURL({ format: 'png', dynamic: true }))
      .setColor(client.config.colors.purple)
      .setAuthor(`Muted ${toMute.user.tag} (${toMute.user.id})`)
      .setFooter(`ID: ${toMute.user.id} | Case: ${info.id}`)
      .addField('User', `${toMute.user.toString()} (${toMute.user.tag})`)
      .addField('Moderator', `${message.author.toString()} (${message.author.tag})`);

    if (reason) { dmMsg += `\n\n⚙️ **Reason \`${reason}\`**`; modEmbed.addField('Reason', reason); message.guild.modbase.update({ reason: reason }, { where: { id: info.id } }); }

    toMute.user.send(dmMsg);
    toMute.roles.add(role);
    await settings.get('modLogChannel')
      .then(async modLogChannel => {
        modLogChannel = message.guild.channels.find(g => g.name.toLowerCase() === modLogChannel.toLowerCase());
        if (!modLogChannel) return message.send(`⚠️ **Mute completed, but there is no mod log channel set.** Try \`${await settings.get('prefix')}set <edit/add> modLogChannel <channel name>\``);
        if (!message.guild.me.permissionsIn(modLogChannel).permissions.serialize()['SEND_MESSAGES'] || !message.guild.me.permissionsIn(modLogChannel).permissions.serialize()['EMBED_LINKS']) {
          modLogChannel.overwritePermissions(client.user, { SEND_MESSAGES: true, EMBED_LINKS: true }).catch(() => { return message.send(`⚠️ **Mute completed, but I errored:**\nI tried to give myself permissions to send messages or post embeds in ${modLogChannel}, but I couldn't. Please make sure I have the \`Manage Roles\` permission, as that allows me to.`); });
        }
        await modLogChannel.send(modEmbed);
        await message.send(`✅ \`|\` ${mutedEmote} **Muted user \`${toMute.user.tag}\`**`);
      })
      .catch(async e => message.send(`❌ **There was an error finding the mod log channel:** \`${e.stack}\``));
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'Moderator'
};

exports.help = {
  name: 'mute',
  description: 'Mute a user',
  usage: 'mute <@user> [reason]',
  category: 'Moderation'
};