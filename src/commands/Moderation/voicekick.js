const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const toKick = message.mentions.users.first();
  const toKickM = message.mentions.members.first();
  const reason = args.slice(1).join(' ');

  if(!message.guild.me.permissions.has('MOVE_MEMBERS')) return message.send(':x: `|` :boot: **I am missing permissions:** `Move Members`');
  if(!message.guild.me.permissions.has('MANAGE_CHANNELS')) return message.send(':x: `|` :boot: **I am missing permissions:** `Manage Channels` ');
  if(!message.member.permissions.has('KICK_MEMBERS')) return message.send(':x: `|` :boot: **You are missing permissions:** `Kick Members`');
  if(!toKick) return message.send(':x: `|` :boot: **You didn\'t mention someone to voicekick!**');
  if(!message.member.voiceChannel) return message.send(':x: `|` :boot: **You are not in the voice channel!**');
  if(!toKickM.voiceChannel) return message.send(`:x: \`|\` :boot: ${toKick.toString()} **isn't in a voice channel!**`);
  if(!toKickM.voiceChannel === message.member.voiceChannel) return message.send(`:x: \`|\` :boot: **You must be in the same voice channel as** ${toKick.toString()}`);

  await message.guild.modbase.create({
    victim: toKick.id,
    moderator: message.author.id,
    type: 'voicekick'
  }).then(async info => {
    let dmMsg = `:boot: **You were voicekicked from** \`${message.member.voiceChannel.name}\`, **in** \`${message.guild.name}\` \`|\` :bust_in_silhouette: **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;

    const modEmbed = new Discord.RichEmbed()
      .setThumbnail(toKick.avatarURL)
      .setColor('0xA80000')
      .setFooter(`ID: ${toKick.id} | Case: ${info.id}`)
      .addField('Voicekicked User', `${toKick.toString()} (${toKick.tag})`)
      .addField('Moderator', `${message.author.toString()} (${message.author.tag})`)
      .addField('Channel:', message.member.voiceChannel.name);

    if(reason) {dmMsg += `\n\n:gear: **Reason: \`${reason}\`**`; modEmbed.addField('Reason', reason); message.guild.modbase.update({ reason: reason }, { where: {id: info.id }});}

    const vc = await message.guild.createChannel('Voice Kick', 'voice');
    await toKickM.setVoiceChannel(vc);
    await vc.delete();
    toKick.send(dmMsg);
    await message.guild.settings.get('modLogChannel')
      .then(async modLogChannel => {
        modLogChannel = message.guild.channels.find(g => g.name.toLowerCase() === modLogChannel.toLowerCase());
        if (modLogChannel === null) return message.send(`:warning: **Voicekick completed, but there is no mod log channel set.** Try \`${await message.guild.settings.get('prefix')}set <edit/add> modLogChannel <channel name>\``);
        if (!message.guild.me.permissionsIn(modLogChannel).serialize()['SEND_MESSAGES'] || !message.guild.me.permissionsIn(modLogChannel).serialize()['EMBED_LINKS']) {
          modLogChannel.overwritePermissions(client.user, { SEND_MESSAGES: true, EMBED_LINKS: true }).catch(() => { return message.send(`:warning: **Ban completed, but I errored:**\nI tried to give myself permissions to send messages or post embeds in ${modLogChannel}, but I couldn't. Please make sure I have the \`Manage Roles\` permission, as that allows me to.`); });
        }
        await modLogChannel.send(modEmbed);
        await message.send(`:white_check_mark: \`|\` :boot: **Voicekicked user \`${toKick.tag}\`**`);
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
  name: 'voicekick',
  description: 'Kick someone from the current voice channel',
  usage: 'voicekick <@user> [reason]',
  category: 'Moderation'
};