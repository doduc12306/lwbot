const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  var role = message.guild.roles.find('name', 'Muted') || message.guild.roles.find('name', 'muted');
  var toUnmute = message.mentions.members.first();
  var reason = args.slice(1).join(' ');
  var unmutedEmote = '<:unmuted:459458804376141824>';

  if(!message.guild.me.permissions.has('MANAGE_ROLES')) return message.channel.send(`:x: \`|\` ${unmutedEmote} **I am missing permissions: \`Manage Roles\`**`);
  if(!toUnmute) return message.channel.send(`:x: \`|\` ${unmutedEmote} **You didn't mention someone to unmute!**`);
  if(message.guild.me.highestRole.position < toUnmute.highestRole.position) return message.channel.send(`:x: \`|\` ${unmutedEmote} **You need to move my role (${message.guild.me.highestRole.name}) above ${toUnmute.toString()}'s (${toUnmute.highestRole.name})!**`);
  if(!toUnmute.roles.has(role.id)) return message.channel.send(`:x: \`|\` ${unmutedEmote} **${toUnmute.user.tag} is already unmuted!**`);

  await message.guild.modbase.create({
    victim: toUnmute.id,
    moderator: message.author.id,
    type: 'unmute'
  }).then(async info => {
    var dmMsg = `${unmutedEmote} **You were unmuted in** \`${message.guild.name}\` \`|\` :busts_in_silhouette: **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;

    var modEmbed = new Discord.RichEmbed()
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
        message.guild.channels.find('name', modLogChannel) ? message.guild.channels.find('name', modLogChannel).send(modEmbed) : false; await message.channel.send(`:white_check_mark: \`|\` ${unmutedEmote} **Unmuted user \`${toUnmute.tag}\`**`);
      })
      .catch(async () => message.channel.send(`:warning: **Unmute completed, but there is no mod log channel set.** Try \`${await message.guild.settings.get('prefix')}set <edit/add> modLogChannel <channel name>\``));
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