const Discord = require('discord.js');
var parse = require('parse-duration');
const moment = require('moment');
require('moment-duration-format');

module.exports.run = async (client, message, args) => {
  var role = message.guild.roles.find('name', 'Muted') || message.guild.roles.find('name', 'muted');
  var toMute = message.mentions.members.first();
  var reason = args.slice(2).join(' ');
  var mutedEmote = '<:muted:459458717856038943>';

  var duration = args[1];
  var durationMs = parse(duration);
  var durationHR = moment.duration(durationMs).format('M [months] W [weeks] D [days], H [hrs], m [mins], s [secs]'); // HR = "Human Readable"

  if(!message.guild.me.permissions.has('MANAGE_ROLES')) return message.channel.send(`:x: \`|\` ${mutedEmote} **I am missing permissions: \`Manage Roles\``);
  if(!toMute) return message.channel.send(`:x: \`|\` ${mutedEmote} **You didn't mention someone to mute!**`);
  if(toMute.permissions.has('ADMINISTRATOR')) return message.channel.send(`:x: \`|\` ${mutedEmote} **${toMute.toString()} could not be muted because they have Administrator!`);
  if(message.guild.me.highestRole.position < toMute.highestRole.position) return message.channel.send(`:x: \`|\` ${mutedEmote} **You need to move my role (${message.guild.me.highestRole.name}) above ${toMute.toString()}'s (${toMute.highestRole.name})!**`);
  if(toMute.roles.has(role.id)) return message.channel.send(`:x: \`|\` ${mutedEmote} **${toMute.toString()} is already muted!**`);

  await message.guild.modbase.create({
    victim: toMute.id,
    moderator: message.author.id,
    type: 'mute',
    duration: durationMs
  }).then(async info => {
    var dmMsg = `${mutedEmote} **You were tempmuted in** \`${message.guild.name}\` **for** \`${durationHR}\` \`|\` :busts_in_silhouette: **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;

    var modEmbed = new Discord.RichEmbed()
      .setThumbnail(toMute.user.avatarURL)
      .setColor(client.config.colors.purple)
      .setFooter(`ID: ${toMute.user.id} | Case: ${info.id}`)
      .addField('Muted User', `${toMute.user.toString()} (${toMute.user.tag})`)
      .addField('Moderator', `${message.author.toString()} (${message.author.tag})`)
      .addField('Duration', durationHR);

    if(reason) {dmMsg += `\n\n:gear: **Reason \`${reason}\`**`; modEmbed.addField('Reason', reason); message.guild.modbase.update({reason: reason}, {where: {id: info.id}});}

    var modLogChannel = await message.guild.settings.get('modLogChannel');
    toMute.user.send(dmMsg);
    toMute.addRole(role);
    message.guild.channels.find('name', modLogChannel) ? message.guild.channels.find('name', modLogChannel).send(modEmbed) : false;
    message.channel.send(`:white_check_mark: \`|\` ${mutedEmote} **Tempmuted user \`${toMute.user.tag}\` for \`${durationHR}\`**`);

    setTimeout(async () => {
      await message.guild.modbase.create({
        victim: toMute.id,
        moderator: client.user.id,
        type: 'unmute',
      }).then(async info => {
        modEmbed = new Discord.RichEmbed()
          .setThumbnail(toMute.avatarURL)
          .setColor(client.config.colors.green)
          .setAuthor(`Unmuted ${toMute.user.tag} (${toMute.id})`)
          .setFooter(`ID: ${toMute.id} | Case: ${info.id}`)
          .addField('User', `${toMute.toString()} (${toMute.user.tag})`)
          .addField('Moderator', client.user.toString());

        if(!reason) {message.guild.modbase.update({ reason: 'Tempmute auto unmute' }, { where: {id: info.id}}); await modEmbed.addField('Reason', 'Tempmute auto unmute');}
        else {message.guild.modbase.update({ reason: `${reason} | Tempmute auto unmute`}, { where: {id: info.id}}); await modEmbed.addField('Reason', `${reason} | Tempmute auto unmute`);}

        var modLogChannel = await message.guild.settings.get('modLogChannel');
        toMute.removeRole(role);
        message.guild.channels.find('name', modLogChannel) ? message.guild.channels.find('name', modLogChannel).send(modEmbed) : false;
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