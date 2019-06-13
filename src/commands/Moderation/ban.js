const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
  const toBan = message.mentions.users.first();
  const toBanM = message.mentions.members.first();
  const reason = args.slice(1).join(' ');
  const bhEmote = '<:banhammer:459184964110385153>';

  if(!message.guild.me.permissions.has('BAN_MEMBERS')) return message.send(`❌ \`|\` ${bhEmote} **I am missing permissions:** \`Ban Members\``);
  if(!message.member.permissions.has('BAN_MEMBERS')) return message.send(`❌ \`|\` ${bhEmote} **You are missing permissions:** \`Ban Members\``);
  if(!toBan) return message.send(`❌ \`|\` ${bhEmote} **You didn't mention someone to ban!**`);
  if(!toBanM.bannable) return message.send(`❌ \`|\` ${bhEmote} **This member could not be banned!**`);

  await message.guild.modbase.create({
    victim: toBan.id,
    moderator: message.author.id,
    type: 'ban'
  }).then(async info => {
    let dmMsg = `${bhEmote} **You were banned from** \`${message.guild.name}\` \`|\` 👤 **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;

    const modEmbed = new Discord.RichEmbed()
      .setThumbnail(toBan.avatarURL)
      .setColor(client.config.colors.red)
      .setFooter(`ID: ${toBan.id} | Case: ${info.id}`)
      .addField('Banned User', `${toBan.toString()} (${toBan.tag})`)
      .addField('Moderator', `${message.author.toString()} (${message.author.tag})`);

    if(reason) {dmMsg += `\n\n⚙️ **Reason: \`${reason}\`**`; modEmbed.addField('Reason', reason); message.guild.modbase.update({ reason: reason }, { where: {id: info.id }});}

    await toBan.send(dmMsg);
    await message.guild.ban(toBan, {days: 2});
    await message.guild.settings.get('modLogChannel')
      .then(async modLogChannel => {
        modLogChannel = message.guild.channels.find(g => g.name.toLowerCase() === modLogChannel.toLowerCase());
        if (!modLogChannel) return message.send(`⚠️ **Ban completed, but there is no mod log channel set.** Try \`${await message.guild.settings.get('prefix')}set <edit/add> modLogChannel <channel name>\``);
        if (!message.guild.me.permissionsIn(modLogChannel).serialize()['SEND_MESSAGES'] || !message.guild.me.permissionsIn(modLogChannel).serialize()['EMBED_LINKS']) {
          modLogChannel.overwritePermissions(client.user, { SEND_MESSAGES: true, EMBED_LINKS: true }).catch(() => { return message.send(`⚠️ **Ban completed, but I errored:**\nI tried to give myself permissions to send messages or post embeds in ${modLogChannel}, but I couldn't. Please make sure I have the \`Manage Roles\` permission, as that allows me to.`); });
        }
        await modLogChannel.send(modEmbed);
        await message.send(`✅ \`|\` ${bhEmote} **Banned user \`${toBan.tag}\`**`);
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
  name: 'ban',
  description: 'Ban someone from the server',
  usage: 'ban <@user> [reason]',
  category: 'Moderation'
};