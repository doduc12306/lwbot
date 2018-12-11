const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  try {
    var reason = args.slice(1).join(' ');
    var unBanHammer = '<:unbanhammer:459404085301346304>';

    if(!message.guild.me.permissions.has('BAN_MEMBERS')) return message.channel.send(`:x: \`|\` ${unBanHammer} **I am missing permissions:** \`Ban Members\``);
    if(!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send(`:x: \`|\` ${unBanHammer} **You are missing permissions:** \`Ban Members\``);
    if(!args[0]) return message.channel.send(`:x: \`|\` ${unBanHammer} **You didn't give the ID of someone to unban!**`);
    await client.fetchUser(args[0]).catch(() => message.channel.send(`:x: \`|\` ${unBanHammer} **I could not find that user!** (Is that the correct ID?)`));

    var toUnban = await client.fetchUser(args[0]);

    await message.guild.modbase.create({
      victim: toUnban.id,
      moderator: message.author.id,
      type: 'unban'
    }).then(async info => {
      var modEmbed = new Discord.RichEmbed()
        .setThumbnail(toUnban.avatarURL)
        .setColor(client.config.colors.green)
        .setFooter(`ID: ${toUnban.id} | Case: ${info.id}`)
        .addField('Unbanned User', `${toUnban.toString()} (${toUnban.tag})`)
        .addField('Moderator', `${message.author.toString()} (${message.author.tag})`);

      if(reason) {modEmbed.addField('Reason', reason); message.guild.modbase.update({ reason: reason }, { where: {id: info.id }});}

      await message.guild.unban(toUnban.id);
      await message.guild.settings.get('modLogChannel')
        .then(async modLogChannel => {
          modLogChannel = message.guild.channels.find(g => g.name.toLowerCase() === modLogChannel.toLowerCase());
          if (modLogChannel === null) return message.channel.send(`:warning: **Unban completed, but there is no mod log channel set.** Try \`${await message.guild.settings.get('prefix')}set <edit/add> modLogChannel <channel name>\``);
          if (!message.guild.me.permissionsIn(modLogChannel).serialize()['SEND_MESSAGES'] || !message.guild.me.permissionsIn(modLogChannel).serialize()['EMBED_LINKS']) {
            modLogChannel.overwritePermissions(client.user, { SEND_MESSAGES: true, EMBED_LINKS: true }).catch(() => { return message.channel.send(`:warning: **Unban completed, but I errored:**\nI tried to give myself permissions to send messages or post embeds in ${modLogChannel}, but I couldn't. Please make sure I have the \`Manage Roles\` permission, as that allows me to.`); });
          }
          await modLogChannel.send(modEmbed);
          await message.channel.send(`:white_check_mark: \`|\` ${unBanHammer} **Unbanned user \`${toUnban.tag}\`**`);
        })
        .catch(async e => message.channel.send(`:x: **There was an error finding the mod log channel:** \`${e.stack}\``));
    });
  } catch (e) {console.log(e);}

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