const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  var toKick = message.mentions.users.first();
  var toKickM = message.mentions.members.first();
  var reason = args.slice(1).join(' ');

  if(!message.guild.me.permissions.has('MOVE_MEMBERS')) return message.channel.send(':x: `|` :boot: **I am missing permissions:** `Move Members`');
  if(!message.guild.me.permissions.has('MANAGE_CHANNELS')) return message.channel.send(':x: `|` :boot: **I am missing permissions:** `Manage Channels` ');
  if(!message.member.permissions.has('KICK_MEMBERS')) return message.channel.send(':x: `|` :boot: **You are missing permissions:** `Kick Members`');
  if(!toKick) return message.channel.send(':x: `|` :boot: **You didn\'t mention someone to voicekick!**');
  if(!message.member.voiceChannel) return message.channel.send(':x: `|` :boot: **You are not in the voice channel!**');
  if(!toKickM.voiceChannel) return message.channel.send(`:x: \`|\` :boot: ${toKick.toString()} **isn't in a voice channel!**`);
  if(!toKickM.voiceChannel === message.member.voiceChannel) return message.channel.send(`:x: \`|\` :boot: **You must be in the same voice channel as** ${toKick.toString()}`);

  await message.guild.modbase.create({
    victim: toKick.id,
    moderator: message.author.id,
    type: 'voicekick'
  }).then(async info => {
    var dmMsg = `:boot: **You were voicekicked from** \`${message.member.voiceChannel.name}\`, **in** \`${message.guild.name}\` \`|\` :bust_in_silhouette: **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;

    var modEmbed = new Discord.RichEmbed()
      .setThumbnail(toKick.avatarURL)
      .setColor('0xA80000')
      .setFooter(`ID: ${toKick.id} | Case: ${info.id}`)
      .addField('Voicekicked User', `${toKick.toString()} (${toKick.tag})`)
      .addField('Moderator', `${message.author.toString()} (${message.author.tag})`)
      .addField('Channel:', message.member.voiceChannel.name);

    if(reason) {dmMsg += `\n\n:gear: **Reason: \`${reason}\`**`; modEmbed.addField('Reason', reason); message.guild.modbase.update({ reason: reason }, { where: {id: info.id }});}

    var modLogChannel = await message.guild.settings.get('modLogChannel');
    var vc = await message.guild.createChannel('Voice Kick', 'voice');
    await toKickM.setVoiceChannel(vc);
    await vc.delete();
    toKick.send(dmMsg);
    message.guild.channels.find('name', modLogChannel) ? message.guild.channels.find('name', modLogChannel).send(modEmbed) : false;
    await message.channel.send(`:white_check_mark: \`|\` :boot: **Voicekicked user \`${toKick.tag}\`**`);

  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'Moderator'
};

exports.help = {
  name: 'voicekick',
  description: 'Kick someone from the current voice channel',
  usage: 'voicekick <@user> [reason]',
  category: 'Moderation'
};