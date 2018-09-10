const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  var toKick = message.mentions.users.first();
  var toKickM = message.mentions.members.first();
  var reason = args.slice(1).join(' ');

  if(!message.guild.me.permissions.has('KICK_MEMBERS')) return message.channel.send(':x: `|` :boot: **I am missing permissions:** `Kick Members`');
  if(!message.member.permissions.has('KICK_MEMBERS')) return message.channel.send(':x: `|` :boot: **You are missing permissions:** `Kick Members`');
  if(!toKick) return message.channel.send(':x: `|` :boot: **You didn\'t mention someone to kick!**');
  if(!toKickM.kickable) return message.channel.send(':x: `|` :boot: **This member could not be kicked!**');

  await message.guild.modbase.create({
    victim: toKick.id,
    moderator: message.author.id,
    type: 'kick'
  }).then(async info => {
    var dmMsg = `:boot: **You were kicked from** \`${message.guild.name}\` \`|\` :bust_in_silhouette: **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;

    var modEmbed = new Discord.RichEmbed()
      .setThumbnail(toKick.avatarURL)
      .setColor('0xff8e2b')
      .setFooter(`ID: ${toKick.id} | Case: ${info.id}`)
      .addField('Kicked User', `${toKick.toString()} (${toKick.tag})`)
      .addField('Moderator', `${message.author.toString()} (${message.author.tag})`);

    if(reason) {dmMsg += `\n\n:gear: **Reason: \`${reason}\`**`; modEmbed.addField('Reason', reason); message.guild.modbase.update({ reason: reason }, { where: {id: info.id }});}

    var modLogChannel = await message.guild.settings.get('modLogChannel');
    await toKick.send(dmMsg);
    await toKickM.kick(toKick);
    message.guild.channels.find('name', modLogChannel) ? message.guild.channels.find('name', modLogChannel).send(modEmbed) : false;
    await message.channel.send(`:white_check_mark: \`|\` :boot: **Kicked user \`${toKick.tag}\`**`);

  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'Moderator'
};

exports.help = {
  name: 'kick',
  description: 'Kick someone from the server',
  usage: 'kick <@user> [reason]',
  category: 'Moderation'
};