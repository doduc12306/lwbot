const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const toWarn = message.mentions.users.first();
  const reason = args.slice(1).join(' ');

  if (!toWarn) return message.send('❌ `|` ⚠️ **You didn\'t mention someone to warn!**');

  await message.guild.modbase.create({
    victim: toWarn.id,
    moderator: message.author.id,
    type: 'warn'
  }).then(async info => {
    let dmMsg = `⚠️ **You were warned in** \`${message.guild.name}\` \`|\` 👤 **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;

    const modEmbed = new Discord.RichEmbed()
      .setThumbnail(toWarn.avatarURL)
      .setColor(client.config.colors.yellow)
      .setFooter(`ID: ${toWarn.id} | Case: ${info.id}`)
      .addField('Warned User', `${toWarn.toString()} (${toWarn.tag})`)
      .addField('Moderator', `${message.author.toString()} (${message.author.tag})`);

    if (reason) { dmMsg += `\n\n⚙️ **Reason: \`${reason}\`**`; modEmbed.addField('Reason', reason); message.guild.modbase.update({ reason: reason }, { where: { id: info.id } }); }

    toWarn.send(dmMsg);
    await message.guild.settings.get('modLogChannel')
      .then(async modLogChannel => {
        modLogChannel = message.guild.channels.find(g => g.name.toLowerCase() === modLogChannel.toLowerCase());
        if (!modLogChannel) return message.send(`⚠️ **Warning completed, but there is no mod log channel set.** Try \`${await message.guild.settings.get('prefix')}set <edit/add> modLogChannel <channel name>\``);
        if (!message.guild.me.permissionsIn(modLogChannel).serialize()['SEND_MESSAGES'] || !message.guild.me.permissionsIn(modLogChannel).serialize()['EMBED_LINKS']) {
          modLogChannel.overwritePermissions(client.user, { SEND_MESSAGES: true, EMBED_LINKS: true }).catch(() => { return message.send(`⚠️ **Warn completed, but I errored:**\nI tried to give myself permissions to send messages or post embeds in ${modLogChannel}, but I couldn't. Please make sure I have the \`Manage Roles\` permission, as that allows me to.`); });
        }
        await modLogChannel.send(modEmbed);
        await message.send(`✅ \`|\` ⚠️ **Warned user \`${toWarn.tag}\`**`);
      })
      .catch(async e => message.send(`❌ **There was an error finding the mod log channel:** \`${e.stack}\``));
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['strike'],
  permLevel: 'Moderator'
};

exports.help = {
  name: 'warn',
  description: 'Warn someone',
  usage: 'warn <@user> [reason]',
  category: 'Moderation'
};