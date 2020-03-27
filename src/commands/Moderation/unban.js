const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const GuildSettings = require('../../dbFunctions/message/settings');
  const settings = new GuildSettings(message.guild.id);
  try {
    const reason = args.slice(1).join(' ');
    const unBanHammer = '<:unbanhammer:459404085301346304>';

    if (!message.guild.me.permissions.has('BAN_MEMBERS')) return message.send(`❌ \`|\` ${unBanHammer} **I am missing permissions:** \`Ban Members\``);
    if (!message.member.permissions.has('BAN_MEMBERS')) return message.send(`❌ \`|\` ${unBanHammer} **You are missing permissions:** \`Ban Members\``);
    if (!args[0]) return message.send(`❌ \`|\` ${unBanHammer} **You didn't give the ID of someone to unban!**`);
    await client.users.fetch(args[0]).catch(() => message.send(`❌ \`|\` ${unBanHammer} **I could not find that user!** (Is that the correct ID?)`));

    const toUnban = await client.users.fetch(args[0]);

    await message.guild.modbase.create({
      victim: toUnban.id,
      moderator: message.author.id,
      type: 'unban'
    }).then(async info => {
      const modEmbed = new Discord.MessageEmbed()
        .setTitle('Member Unbanned')
        .setThumbnail(toUnban.displayAvatarURL({ format: 'png', dynamic: true }))
        .setColor(client.accentColor)
        .setFooter(`ID: ${toUnban.id} | Case: ${info.id}`)
        .addField('Unbanned Member', `${toUnban.toString()} (${toUnban.tag})`)
        .addField('Moderator', `${message.author.toString()} (${message.author.tag})`);

      if (reason) { modEmbed.addField('Reason', reason); message.guild.modbase.update({ reason: reason }, { where: { id: info.id } }); }

      await message.guild.members.unban(toUnban.id);
      await settings.get('modLogChannel')
        .then(async modLogChannel => {
          modLogChannel = message.guild.channels.cache.find(g => g.name.toLowerCase() === modLogChannel.toLowerCase());
          if (!modLogChannel) return message.send(`⚠️ **Unban completed, but there is no mod log channel set.** Try \`${await settings.get('prefix')}set <edit/add> modLogChannel <channel name>\``);
          if (!message.guild.me.permissionsIn(modLogChannel).serialize()['SEND_MESSAGES'] || !message.guild.me.permissionsIn(modLogChannel).serialize()['EMBED_LINKS']) {
            modLogChannel.createOverwrite(client.user, { SEND_MESSAGES: true, EMBED_LINKS: true }).catch(() => { return message.send(`⚠️ **Unban completed, but I errored:**\nI tried to give myself permissions to send messages or post embeds in ${modLogChannel}, but I couldn't. Please make sure I have the \`Manage Roles\` permission, as that allows me to.`); });
          }
          await modLogChannel.send(modEmbed);
          await message.send(`✅ \`|\` ${unBanHammer} **Unbanned user \`${toUnban.tag}\`**`);
        })
        .catch(async e => message.send(`❌ **There was an error finding the mod log channel:** \`${e.stack}\``));
    });
  } catch (e) { client.logger.error(e); }

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['pardon'],
  permLevel: 'Moderator'
};

exports.help = {
  name: 'unban',
  description: 'Unban someone',
  usage: 'unban <id> [reason]',
  category: 'Moderation'
};