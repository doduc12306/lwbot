const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const role = message.guild.roles.find(role => role.name === 'Muted') || message.guild.roles.find(role => role.name === 'muted');
  const toUnmute = message.mentions.members.first();
  const reason = args.slice(1).join(' ');
  const unmutedEmote = '<:unmuted:459458804376141824>';

  if(!message.guild.me.permissions.has('MANAGE_ROLES')) return message.send(`:x: \`|\` ${unmutedEmote} **I am missing permissions: \`Manage Roles\`**`);
  if(!toUnmute) return message.send(`:x: \`|\` ${unmutedEmote} **You didn't mention someone to unmute!**`);
  if(message.guild.me.highestRole.position < toUnmute.highestRole.position) return message.send(`:x: \`|\` ${unmutedEmote} **You need to move my role (${message.guild.me.highestRole.name}) above ${toUnmute.toString()}'s (${toUnmute.highestRole.name})!**`);
  if(!toUnmute.roles.has(role.id)) return message.send(`:x: \`|\` ${unmutedEmote} **${toUnmute.user.tag} is already unmuted!**`);

  await message.guild.modbase.create({
    victim: toUnmute.id,
    moderator: message.author.id,
    type: 'unmute'
  }).then(async info => {
    let dmMsg = `${unmutedEmote} **You were unmuted in** \`${message.guild.name}\` \`|\` :busts_in_silhouette: **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;

    const modEmbed = new Discord.RichEmbed()
      .setThumbnail(toUnmute.user.avatarURL)
      .setColor(client.config.colors.green)
      .setFooter(`ID: ${toUnmute.user.id} | Case: ${info.id}`)
      .addField('Unmuted User', `${toUnmute.user.toString()} (${toUnmute.user.tag})`)
      .addField('Moderator', `${message.author.toString()} (${message.author.tag})`);

    if(reason) {dmMsg += `\n\n:gear: **Reason \`${reason}\`**`; modEmbed.addField('Reason', reason); message.guild.modbase.update({reason: reason}, {where: {id: info.id}});}

    toUnmute.user.send(dmMsg);
    toUnmute.removeRole(role);
    await message.guild.settings.get('modLogChannel')
      .then(async modLogChannel => {
        modLogChannel = message.guild.channels.find(g => g.name.toLowerCase() === modLogChannel.toLowerCase());
        if (modLogChannel === null) return message.send(`:warning: **Unmute completed, but there is no mod log channel set.** Try \`${await message.guild.settings.get('prefix')}set <edit/add> modLogChannel <channel name>\``);
        if (!message.guild.me.permissionsIn(modLogChannel).serialize()['SEND_MESSAGES'] || !message.guild.me.permissionsIn(modLogChannel).serialize()['EMBED_LINKS']) {
          modLogChannel.overwritePermissions(client.user, { SEND_MESSAGES: true, EMBED_LINKS: true }).catch(() => { return message.send(`:warning: **Unmute completed, but I errored:**\nI tried to give myself permissions to send messages or post embeds in ${modLogChannel}, but I couldn't. Please make sure I have the \`Manage Roles\` permission, as that allows me to.`); });
        }
        await modLogChannel.send(modEmbed);
        await message.send(`:white_check_mark: \`|\` ${unmutedEmote} **Unmuted user \`${toUnmute.user.tag}\`**`);
      })
      .catch(async e => message.send(`:x: **There was an error finding the mod log channel:** \`${e.stack}\``));
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'Moderator'
};

exports.help = {
  name: 'unmute',
  description: 'Unmute a user',
  usage: 'unmute <@user> [reason]',
  category: 'Moderation'
};