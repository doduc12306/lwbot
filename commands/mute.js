const Discord = require(`discord.js`);
const Sequelize = require(`sequelize`);

module.exports.run = async (client, message, args) => {
  var modBase = await new Sequelize(`database`, `user`, `password`, {host: `localhost`,dialect: `sqlite`,storage: `databases/servers/${message.guild.id}.sqlite`});
  modBase = await modBase.define(`moderation`, {victim: {type: Sequelize.STRING,allowNull: false},moderator: {type: Sequelize.STRING,allowNull: false},type: {type: Sequelize.STRING,allowNull: false},reason: Sequelize.STRING,duration: Sequelize.STRING});
  await modBase.sync();

  var settings = client.settings.get(message.guild.id);
  var role = message.guild.roles.find(`name`, `Muted`) || message.guild.roles.find(`name`, `muted`);
  var toMute = message.mentions.members.first();
  var reason = args.slice(1).join(` `);
  var mutedEmote = `<:muted:459458717856038943>`;

  if(!message.guild.me.permissions.has(`MANAGE_ROLES`)) return message.channel.send(`:x: \`|\` ${mutedEmote} **I am missing permissions: \`Manage Roles\``);
  if(!toMute) return message.channel.send(`:x: \`|\` ${mutedEmote} **You didn't mention someone to mute!**`);
  if(toMute.permissions.has(`ADMINISTRATOR`)) return message.channel.send(`:x: \`|\` ${mutedEmote} **${toMute.toString()} could not be muted because they have Administrator!`);
  if(message.guild.me.highestRole.position < toMute.highestRole.position) return message.channel.send(`:x: \`|\` ${mutedEmote} **You need to move my role (${message.guild.me.highestRole.name}) above ${toMute.toString()}'s (${toMute.highestRole.name})!**`);
  if(toMute.roles.has(role.id)) return message.channel.send(`:x: \`|\` ${mutedEmote} **${toMute.toString()} is already muted!**`);

  const input = modBase.create({
    victim: toMute.id,
    moderator: message.author.id,
    type: `mute`
  }).then(info => {
    if(reason) modBase.update({reason: reason}, {where: {id: info.id}});

    var dmMsg = `${mutedEmote} ***You were muted in*** \`${message.guild.name}\` \`|\` :busts_in_silhouette: **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;

    var modEmbed = new Discord.RichEmbed()
      .setThumbnail(toMute.user.avatarURL)
      .setColor(client.config.colors.purple)
      .setAuthor(`Muted ${toMute.user.tag} (${toMute.user.id})`)
      .setFooter(`ID: ${toMute.user.id} | Case: ${info.id}`)
      .addField(`User`, `${toMute.user.toString()} (${toMute.user.tag})`)
      .addField(`Moderator`, `${message.author.toString()} (${message.author.tag})`);

    if(reason) {dmMsg += `\n\n:gear: **Reason \`${reason}\`**`; modEmbed.addField(`Reason`, reason);}

    toMute.user.send(dmMsg);
    toMute.addRole(role);
    message.guild.channels.find(`name`, settings.modLogChannel).send(modEmbed);
    message.channel.send(`:white_check_mark: \`|\` ${mutedEmote} **Muted user \`${toMute.user.tag}\`**`);
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