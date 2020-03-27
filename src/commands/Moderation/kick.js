const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const GuildSettings = require('../../dbFunctions/message/settings');
  const settings = new GuildSettings(message.guild.id);
  const toKick = message.mentions.users.first();
  const toKickM = message.mentions.members.first();
  const reason = args.slice(1).join(' ');

  if (!message.guild.me.permissions.has('KICK_MEMBERS')) return message.send('❌ `|` 👢 **I am missing permissions:** `Kick Members`');
  if (!message.member.permissions.has('KICK_MEMBERS')) return message.send('❌ `|` 👢 **You are missing permissions:** `Kick Members`');
  if (!toKick) return message.send('❌ `|` 👢 **You didn\'t mention someone to kick!**');
  if (!toKickM.kickable) return message.send('❌ `|` 👢 **This member could not be kicked!**');

  await message.guild.modbase.create({
    victim: toKick.id,
    moderator: message.author.id,
    type: 'kick'
  }).then(async info => {
    let dmMsg = `👢 **You were kicked from** \`${message.guild.name}\` \`|\` 👤 **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;

    const modEmbed = new Discord.MessageEmbed()
      .setTitle('Member Kicked')
      .setThumbnail(toKick.displayAvatarURL({ format: 'png', dynamic: true }))
      .setColor('0xff8e2b')
      .setFooter(`ID: ${toKick.id} | Case: ${info.id}`)
      .addField('Kicked Member', `${toKick.toString()} (${toKick.tag})`)
      .addField('Moderator', `${message.author.toString()} (${message.author.tag})`);

    if (reason) { dmMsg += `\n\n⚙️ **Reason: \`${reason}\`**`; modEmbed.addField('Reason', reason); message.guild.modbase.update({ reason: reason }, { where: { id: info.id } }); }

    await toKick.send(dmMsg);
    await toKickM.kick(reason ? reason : null);
    await settings.get('modLogChannel')
      .then(async modLogChannel => {
        modLogChannel = message.guild.channels.cache.find(g => g.name.toLowerCase() === modLogChannel.toLowerCase());
        if (!modLogChannel) return message.send(`⚠️ **Kick completed, but there is no mod log channel set.** Try \`${await settings.get('prefix')}set <edit/add> modLogChannel <channel name>\``);
        if (!message.guild.me.permissionsIn(modLogChannel).serialize()['SEND_MESSAGES'] || !message.guild.me.permissionsIn(modLogChannel).serialize()['EMBED_LINKS']) {
          modLogChannel.createOverwrite(client.user, { SEND_MESSAGES: true, EMBED_LINKS: true }).catch(() => { return message.send(`⚠️ **Kick completed, but I errored:**\nI tried to give myself permissions to send messages or post embeds in ${modLogChannel}, but I couldn't. Please make sure I have the \`Manage Roles\` permission, as that allows me to.`); });
        }
        await modLogChannel.send(modEmbed);
        await message.send(`✅ \`|\` 👢 **Kicked user \`${toKick.tag}\`**`);
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
  name: 'kick',
  description: 'Kick someone from the server',
  usage: 'kick <@user> [reason]',
  category: 'Moderation'
};