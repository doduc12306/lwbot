const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const GuildSettings = require('../../dbFunctions/message/settings');
  const settings = new GuildSettings(message.guild.id);
  const toBan = message.mentions.users.first();
  const toBanM = message.mentions.members.first();
  const reason = args.slice(1).join(' ');
  const vbEmote = '<:banhammer:459184964110385153>';

  if (!message.guild.me.permissions.has('MOVE_MEMBERS')) return message.send(`❌ \`|\` ${vbEmote} **I am missing permissions:** \`Move Members\``);
  if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) return message.send(`❌ \`|\` ${vbEmote} **I am missing permissions:** \`Manage Channels\` `);
  if (!message.member.permissions.has('BAN_MEMBERS')) return message.send(`❌ \`|\` ${vbEmote} **You are missing permissions:** \`Ban Members\``);
  if (!toBan) return message.send(`❌ \`|\` ${vbEmote} **You didn't mention someone to voiceban!**`);
  if (!message.member.voiceChannel) return message.send(`❌ \`|\` ${vbEmote} **You are not in the voice channel!**`);
  if (!toBanM.voiceChannel) return message.send(`❌ \`|\` ${vbEmote} ${toBan.toString()} **isn't in a voice channel!**`);
  if (!toBanM.voiceChannel === message.member.voiceChannel) return message.send(`❌ \`|\` ${vbEmote} **You must be in the same voice channel as** ${toBan.toString()}`);

  await message.guild.modbase.create({
    victim: toBan.id,
    moderator: message.author.id,
    type: 'voiceban'
  }).then(async info => {
    let dmMsg = `${vbEmote} **You were voicebanned from** \`${message.member.voiceChannel.name}\`, **in** \`${message.guild.name}\` \`|\` 👤 **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;

    const modEmbed = new Discord.MessageEmbed()
      .setThumbnail(toBan.displayAvatarURL({ format: 'png', dynamic: true }))
      .setColor('0xA80000')
      .setFooter(`ID: ${toBan.id} | Case: ${info.id}`)
      .addField('Voicebanned User', `${toBan.toString()} (${toBan.tag})`)
      .addField('Moderator', `${message.author.toString()} (${message.author.tag})`)
      .addField('Channel:', message.member.voiceChannel.name);

    if (reason) { dmMsg += `\n\n⚙️ **Reason: \`${reason}\`**`; modEmbed.addField('Reason', reason); message.guild.modbase.update({ reason: reason }, { where: { id: info.id } }); }

    const vc = await message.guild.channels.create('Voice Ban', 'voice');
    await toBanM.voice.setChannel(vc);
    await message.member.voiceChannel.overwritePermissions(toBan, { CONNECT: false });
    await vc.delete();
    toBan.send(dmMsg);
    await settings.get('modLogChannel')
      .then(async modLogChannel => {
        modLogChannel = message.guild.channels.find(g => g.name.toLowerCase() === modLogChannel.toLowerCase());
        if (!modLogChannel) return message.send(`⚠️ **Voiceban completed, but there is no mod log channel set.** Try \`${await settings.get('prefix')}set <edit/add> modLogChannel <channel name>\``);
        if (!message.guild.me.permissionsIn(modLogChannel).permissions.serialize()['SEND_MESSAGES'] || !message.guild.me.permissionsIn(modLogChannel).permissions.serialize()['EMBED_LINKS']) {
          modLogChannel.overwritePermissions(client.user, { SEND_MESSAGES: true, EMBED_LINKS: true }).catch(() => { return message.send(`⚠️ **Voiceban completed, but I errored:**\nI tried to give myself permissions to send messages or post embeds in ${modLogChannel}, but I couldn't. Please make sure I have the \`Manage Roles\` permission, as that allows me to.`); });
        }
        await modLogChannel.send(modEmbed);
        await message.send(`✅ \`|\` ${vbEmote} **Voicebanned user \`${toBan.tag}\`**`);
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
  name: 'voiceban',
  description: 'Ban someone from the current voice channel',
  usage: 'voiceban <@user> [reason]',
  category: 'Moderation'
};