const Discord = require(`discord.js`);
const Sequelize = require(`sequelize`);

module.exports.run = async (client, message, args) => {
  var modBase = await new Sequelize(`database`, `user`, `password`, {host: `localhost`,dialect: `sqlite`,storage: `databases/servers/${message.guild.id}.sqlite`});
  modBase = await modBase.define(`moderation`, {victim: {type: Sequelize.STRING,allowNull: false},moderator: {type: Sequelize.STRING,allowNull: false},type: {type: Sequelize.STRING,allowNull: false},reason: Sequelize.STRING,duration: Sequelize.STRING});
  await modBase.sync();

  var settings = client.settings.get(message.guild.id);
  var role = message.guild.roles.find(`name`, `Muted`) || message.guild.roles.find(`name`, `muted`);
  var toUnmute = message.mentions.members.first();
  var reason = args.slice(1).join(` `);
  var unmutedEmote = `<:unmuted:459458804376141824>`;

  if(!message.guild.me.permissions.has(`MANAGE_ROLES`)) return message.channel.send(`:x: \`|\` ${unmutedEmote} **I am missing permissions: \`Manage Roles\`**`);
  if(!toUnmute) return message.channel.send(`:x: \`|\` ${unmutedEmote} **You didn't mention someone to unmute!**`);
  if(message.guild.me.highestRole.position < toUnmute.highestRole.position) return message.channel.send(`:x: \`|\` ${unmutedEmote} **You need to move my role (${message.guild.me.highestRole.name}) above ${toUnmute.toString()}'s (${toUnmute.highestRole.name})!**`);
  if(toUnmute.roles.has(role.id)) return message.channel.send(`:x: \`|\` ${unmutedEmote} **${toUnmute.toString()} is already unmuted!**`);

  const input = modBase.create({
    victim: toUnmute.id,
    moderator: message.author.id,
    type: `unmute`
  }).then(info => {
    if(reason) modBase.update({reason: reason}, {where: {id: info.id}});

    var dmMsg = `${unmutedEmote} **You were unmuted in** \`${message.guild.name}\` \`|\` :busts_in_silhouette: **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;

    var modEmbed = new Discord.RichEmbed()
      .setThumbnail(toUnmute.user.avatarURL)
      .setColor(client.config.colors.green)
      .setAuthor(`Unmuted ${toUnmute.user.tag} (${toUnmute.user.id})`)
      .setFooter(`ID: ${toUnmute.user.id} | Case: ${info.id}`)
      .addField(`User`, `${toUnmute.user.toString()} (${toUnmute.user.tag})`)
      .addField(`Moderator`, `${message.author.toString()} (${message.author.tag})`);

    if(reason) {dmMsg += `\n\n:gear: **Reason \`${reason}\`**`; modEmbed.addField(`Reason`, reason);}

    toUnmute.user.send(dmMsg);
    toUnmute.removeRole(role);
    message.guild.channels.find(`name`, settings.modLogChannel).send(modEmbed);
    message.channel.send(`:white_check_mark: \`|\` ${unmutedEmote} **Unmuted user \`${toUnmute.user.tag}\`**`);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: `Moderator`
};

exports.help = {
  name: `mute`,
  description: `Mute a user`,
  usage: `mute <@user> [reason]`,
  category: `Moderation`
};