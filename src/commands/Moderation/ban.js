const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
  var toBan = message.mentions.users.first();
  var toBanM = message.mentions.members.first();
  var reason = args.slice(1).join(' ');
  var bhEmote = '<:banhammer:459184964110385153>';

  if(!message.guild.me.permissions.has('BAN_MEMBERS')) return message.channel.send(`:x: \`|\` ${bhEmote} **I am missing permissions:** \`Ban Members\``);
  if(!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send(`:x: \`|\` ${bhEmote} **You are missing permissions:** \`Ban Members\``);
  if(!toBan) return message.channel.send(`:x: \`|\` ${bhEmote} **You didn't mention someone to ban!**`);
  if(!toBanM.bannable) return message.channel.send(`:x: \`|\` ${bhEmote} **This member could not be banned!**`);

  await message.guild.modbase.create({
    victim: toBan.id,
    moderator: message.author.id,
    type: 'ban'
  }).then(async info => {
    var dmMsg = `${bhEmote} **You were banned from** \`${message.guild.name}\` \`|\` :bust_in_silhouette: **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;

    var modEmbed = new Discord.RichEmbed()
      .setThumbnail(toBan.avatarURL)
      .setColor(client.config.colors.red)
      .setFooter(`ID: ${toBan.id} | Case: ${info.id}`)
      .addField('Banned User', `${toBan.toString()} (${toBan.tag})`)
      .addField('Moderator', `${message.author.toString()} (${message.author.tag})`);

    if(reason) {dmMsg += `\n\n:gear: **Reason: \`${reason}\`**`; modEmbed.addField('Reason', reason); message.guild.modbase.update({ reason: reason }, { where: {id: info.id }});}

    await toBan.send(dmMsg);
    await message.guild.ban(toBan, {days: 2});
    await message.guild.settings.get('modLogChannel')
      .then(async modLogChannel => {
        message.guild.channels.find('name', modLogChannel) ? message.guild.channels.find('name', modLogChannel).send(modEmbed) : false; await message.channel.send(`:white_check_mark: \`|\` ${bhEmote} **Banned user \`${toBan.user.tag}\`**`);
      })
      .catch(async () => message.channel.send(`:warning: **Ban completed, but there is no mod log channel set.** Try \`${await message.guild.settings.get('prefix')}set <edit/add> modLogChannel <channel name>\``));
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