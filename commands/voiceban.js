const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  var toBan = message.mentions.users.first();
  var toBanM = message.mentions.members.first();
  var reason = args.slice(1).join(' ');
  var vbEmote = '<:banhammer:459184964110385153>';

  if(!message.guild.me.permissions.has('MOVE_MEMBERS')) return message.channel.send(`:x: \`|\` ${vbEmote} **I am missing permissions:** \`Move Members\``);
  if(!message.guild.me.permissions.has('MANAGE_CHANNELS')) return message.channel.send(`:x: \`|\` ${vbEmote} **I am missing permissions:** \`Manage Channels\` `);
  if(!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send(`:x: \`|\` ${vbEmote} **You are missing permissions:** \`Ban Members\``);
  if(!toBan) return message.channel.send(`:x: \`|\` ${vbEmote} **You didn't mention someone to voiceban!**`);
  if(!message.member.voiceChannel) return message.channel.send(`:x: \`|\` ${vbEmote} **You are not in the voice channel!**`);
  if(!toBanM.voiceChannel) return message.channel.send(`:x: \`|\` ${vbEmote} ${toBan.toString()} **isn't in a voice channel!**`);
  if(!toBanM.voiceChannel === message.member.voiceChannel) return message.channel.send(`:x: \`|\` ${vbEmote} **You must be in the same voice channel as** ${toBan.toString()}`);

  await message.guild.modbase.create({
    victim: toBan.id,
    moderator: message.author.id,
    type: 'voiceban'
  }).then(async info => {
    var dmMsg = `${vbEmote} **You were voicebanned from** \`${message.member.voiceChannel.name}\`, **in** \`${message.guild.name}\` \`|\` :bust_in_silhouette: **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;

    var modEmbed = new Discord.RichEmbed()
      .setThumbnail(toBan.avatarURL)
      .setColor('0xA80000')
      .setFooter(`ID: ${toBan.id} | Case: ${info.id}`)
      .addField('Voicebanned User', `${toBan.toString()} (${toBan.tag})`)
      .addField('Moderator', `${message.author.toString()} (${message.author.tag})`)
      .addField('Channel:', message.member.voiceChannel.name);

    if(reason) {dmMsg += `\n\n:gear: **Reason: \`${reason}\`**`; modEmbed.addField('Reason', reason); message.guild.modbase.update({ reason: reason }, { where: {id: info.id }});}

    var modLogChannel = await message.guild.settings.get('modLogChannel').catch(() => {});
    var vc = await message.guild.createChannel('Voice Ban', 'voice');
    await toBanM.setVoiceChannel(vc);
    await message.member.voiceChannel.overwritePermissions(toBan, {CONNECT: false});
    await vc.delete();
    toBan.send(dmMsg);
    message.guild.channels.find('name', modLogChannel) ? message.guild.channels.find('name', modLogChannel).send(modEmbed) : false;
    await message.channel.send(`:white_check_mark: \`|\` ${vbEmote} **Voicebanned user \`${toBan.tag}\`**`);

  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'Moderator'
};

exports.help = {
  name: 'voiceban',
  description: 'Ban someone from the current voice channel',
  usage: 'voiceban <@user> [reason]',
  category: 'Moderation'
};