const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  var role = message.guild.roles.find('name', 'Muted') || message.guild.roles.find('name', 'muted');
  var toMute = message.mentions.members.first();
  var reason = args.slice(1).join(' ');
  var mutedEmote = '<:muted:459458717856038943>';

  if(!message.guild.me.permissions.has('MANAGE_ROLES')) return message.channel.send(`:x: \`|\` ${mutedEmote} **I am missing permissions: \`Manage Roles\``);
  if(!toMute) return message.channel.send(`:x: \`|\` ${mutedEmote} **You didn't mention someone to mute!**`);
  if(toMute.permissions.has('ADMINISTRATOR')) return message.channel.send(`:x: \`|\` ${mutedEmote} **${toMute.toString()} could not be muted because they have Administrator!`);
  if(message.guild.me.highestRole.position < toMute.highestRole.position) return message.channel.send(`:x: \`|\` ${mutedEmote} **You need to move my role (${message.guild.me.highestRole.name}) above ${toMute.toString()}'s (${toMute.highestRole.name})!**`);
  if(toMute.roles.has(role.id)) return message.channel.send(`:x: \`|\` ${mutedEmote} **${toMute.toString()} is already muted!**`);

  await message.guild.modbase.create({
    victim: toMute.id,
    moderator: message.author.id,
    type: 'mute'
  }).then(async info => {
    var dmMsg = `${mutedEmote} **You were muted in** \`${message.guild.name}\` \`|\` :busts_in_silhouette: **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;

    var modEmbed = new Discord.RichEmbed()
      .setThumbnail(toMute.user.avatarURL)
      .setColor(client.config.colors.purple)
      .setAuthor(`Muted ${toMute.user.tag} (${toMute.user.id})`)
      .setFooter(`ID: ${toMute.user.id} | Case: ${info.id}`)
      .addField('User', `${toMute.user.toString()} (${toMute.user.tag})`)
      .addField('Moderator', `${message.author.toString()} (${message.author.tag})`);

    if(reason) {dmMsg += `\n\n:gear: **Reason \`${reason}\`**`; modEmbed.addField('Reason', reason); message.guild.modbase.update({reason: reason}, {where: {id: info.id}});}

    toMute.user.send(dmMsg);
    toMute.addRole(role);
    await message.guild.settings.get('modLogChannel')
      .then(async modLogChannel => {
        message.guild.channels.find('name', modLogChannel) ? message.guild.channels.find('name', modLogChannel).send(modEmbed) : false; await message.channel.send(`:white_check_mark: \`|\` ${mutedEmote} **Muted user \`${toMute.user.tag}\`**`);
      })
      .catch(async () => message.channel.send(`:warning: **Mute completed, but there is no mod log channel set.** Try \`${await message.guild.settings.get('prefix')}set <edit/add> modLogChannel <channel name>\``));
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