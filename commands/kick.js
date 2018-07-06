const Sequelize = require(`sequelize`);
const Discord = require(`discord.js`);

module.exports.run = async (client, message, args) => {
  var modBase = await new Sequelize(`database`, `user`, `password`, {host: `localhost`,dialect: `sqlite`,storage: `databases/servers/${message.guild.id}.sqlite`});
  modBase = await modBase.define(`moderation`, {victim: {type: Sequelize.STRING,allowNull: false},moderator: {type: Sequelize.STRING,allowNull: false},type: {type: Sequelize.STRING,allowNull: false},reason: Sequelize.STRING,duration: Sequelize.STRING});
  await modBase.sync();

  var settings = client.settings.get(message.guild.id);

  var toKick = message.mentions.users.first();
  var toKickM = message.mentions.members.first();
  var reason = args.slice(1).join(` `);

  if(!message.guild.me.permissions.has(`KICK_MEMBERS`)) return message.channel.send(`:x: \`|\` :boot: **I am missing permissions:** \`Kick Members\``);
  if(!message.member.permissions.has(`KICK_MEMBERS`)) return message.channel.send(`:x: \`|\` :boot: **You are missing permissions:** \`Kick Members\``);
  if(!toKick) return message.channel.send(`:x: \`|\` :boot: **You didn't mention someone to kick!**`);
  if(!toKickM.kickable) return message.channel.send(`:x: \`|\` :boot: **This member could not be kicked!**`);

  const input = await modBase.create({
    victim: toKick.id,
    moderator: message.author.id,
    type: `kick`
  }).then(async info => {
    if(reason) modBase.update({ reason: reason }, { where: {id: info.id }});

    var dmMsg = `:boot: **You were kicked from** \`${message.guild.name}\` \`|\` :bust_in_silhouette: **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;
      
    var modEmbed = new Discord.RichEmbed()
      .setThumbnail(toKick.avatarURL)
      .setColor(`0xff8e2b`)
      .setAuthor(`Kicked ${toKick.tag} (${toKick.id})`)
      .setFooter(`ID: ${toKick.id} | Case: ${info.id}`)
      .addField(`User`, `${toKick.toString()} (${toKick.tag})`)
      .addField(`Moderator`, `${message.author.toString()} (${message.author.tag})`);
      
    if(reason) {dmMsg += `\n\n:gear: **Reason: \`${reason}\`**`; modEmbed.addField(`Reason`, reason);}
      
    await toKick.send(dmMsg);
    if(!client.config.debugMode) await toKickM.kick(toKick);
    await message.guild.channels.find(`name`, settings.modLogChannel).send(modEmbed);
    await message.channel.send(`:white_check_mark: \`|\` :boot: **Kicked user \`${toKick.tag}\`**`);

  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: `Moderator`
};

exports.help = {
  name: `kick`,
  description: `Kick someone from the server`,
  usage: `kick <@user> [reason]`,
  category: `Moderation`
};