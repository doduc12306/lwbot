const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const settings = require('../../dbFunctions/message/settings').functions;
  try {
    const reason = args.slice(1).join(' ');
    const bhEmote = '<a:hammerglitched:459396837741297671>';

    if (!message.guild.me.permissions.has('BAN_MEMBERS')) return message.send(`❌ \`|\` ${bhEmote} **I am missing permissions:** \`Ban Members\``);
    if (!message.member.permissions.has('BAN_MEMBERS')) return message.send(`❌ \`|\` ${bhEmote} **You are missing permissions:** \`Ban Members\``);
    if (!args[0]) return message.send(`❌ \`|\` ${bhEmote} **You didn't give the ID of someone to ban!**`);
    await client.fetchUser(args[0]).catch(() => message.send(`❌ \`|\` ${bhEmote} **I could not find that user!**`));

    const toBan = await client.fetchUser(args[0]);

    await message.guild.modbase.create({
      victim: toBan.id,
      moderator: message.author.id,
      type: 'hackban'
    }).then(async info => {
      if (reason) message.guild.modbase.update({ reason: reason }, { where: { id: info.id } });

      const modEmbed = new Discord.RichEmbed()
        .setThumbnail(toBan.displayAvatarURL)
        .setColor(client.config.colors.black)
        .setFooter(`ID: ${toBan.id} | Case: ${info.id}`)
        .addField('Hackbanned User', `${toBan.toString()} (${toBan.tag})`)
        .addField('Moderator', `${message.author.toString()} (${message.author.tag})`);

      if (reason) modEmbed.addField('Reason', reason);

      await message.guild.ban(toBan.id, { days: 2 });
      await settings.get(message.guild.id, 'modLogChannel')
        .then(async modLogChannel => {
          modLogChannel = message.guild.channels.find(g => g.name.toLowerCase() === modLogChannel.toLowerCase());
          if (!modLogChannel) return message.send(`⚠️ **Hackban completed, but there is no mod log channel set.** Try \`${await settings.get(message.guild.id, 'prefix')}set <edit/add> modLogChannel <channel name>\``);
          if (!message.guild.me.permissionsIn(modLogChannel).serialize()['SEND_MESSAGES'] || !message.guild.me.permissionsIn(modLogChannel).serialize()['EMBED_LINKS']) {
            modLogChannel.overwritePermissions(client.user, { SEND_MESSAGES: true, EMBED_LINKS: true }).catch(() => { return message.send(`⚠️ **Hackban completed, but I errored:**\nI tried to give myself permissions to send messages or post embeds in ${modLogChannel}, but I couldn't. Please make sure I have the \`Manage Roles\` permission, as that allows me to.`); });
          }
          await modLogChannel.send(modEmbed);
          await message.send(`✅ \`|\` ${bhEmote} **Hackanned user \`${toBan.tag}\`**`);
        })
        .catch(async e => message.send(`❌ **There was an error finding the mod log channel:** \`${e.stack}\``));
    });
  } catch (e) { client.logger.error(e); }

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['idban'],
  permLevel: 'Moderator'
};

exports.help = {
  name: 'hackban',
  description: 'Ban someone who isn\'t in the server',
  usage: 'hackban <id> [reason]',
  category: 'Moderation'
};