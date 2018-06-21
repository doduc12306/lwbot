const Sequelize = require(`sequelize`);
const Discord = require(`discord.js`);

module.exports.run = async (client, message, args) => {
  var modBase = await new Sequelize(`database`, `user`, `password`, {host: `localhost`,dialect: `sqlite`,storage: `databases/${message.guild.id}.sqlite`});
  modBase = await modBase.define(`moderation`, {victim: {type: Sequelize.STRING,allowNull: false},moderator: {type: Sequelize.STRING,allowNull: false},type: {type: Sequelize.STRING,allowNull: false},reason: Sequelize.STRING,duration: Sequelize.STRING});
  await modBase.sync();

  var settings = client.settings.get(message.guild.id);

  var toBan = message.mentions.users.first();
  var toBanM = message.mentions.members.first();
  var reason = args.slice(1).join(` `);
  var bhEmote = `<:banhammer:459184964110385153>`;

  if(!message.guild.me.permissions.has(`BAN_MEMBERS`)) return message.channel.send(`:x: \`|\` ${bhEmote} **I am missing permissions:** \`Ban Members\``);
  if(!message.member.permissions.has(`BAN_MEMBERS`)) return message.channel.send(`:x: \`|\` ${bhEmote} **You are missing permissions:** \`Ban Members\``);
  if(!toBan) return message.channel.send(`:x: \`|\` ${bhEmote} **You didn't mention someone to ban!**`);
  if(toBan.bot) return message.channel.send(`:x: \`|\` ${bhEmote} **I cannot ban a bot!**`);
  if(!toBanM.bannable) return message.channel.send(`:x: \`|\` ${bhEmote} **This member could not be banned!**`);

  const input = await modBase.create({
    victim: toBan.id,
    moderator: message.author.id,
    type: `ban`
  }).then(async info => {
    if(reason) modBase.update({ reason: reason }, { where: {id: info.id }});

    var dmMsg = `${bhEmote} ***You were banned from*** \`${message.guild.name}\` \`|\` :bust_in_silhouette: **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;
      
    var modEmbed = new Discord.RichEmbed()
      .setThumbnail(toBan.avatarURL)
      .setColor(`0xFF0000`)
      .setAuthor(`Banned ${toBan.tag} (${toBan.id})`)
      .setFooter(`ID: ${toBan.id} | Case: ${info.id}`)
      .addField(`User`, `${toBan.toString()} (${toBan.tag})`)
      .addField(`Moderator`, `${message.author.toString()} (${message.author.tag})`);
      
    if(reason) {dmMsg += `\n\n:gear: **Reason: \`${reason}\`**`; modEmbed.addField(`Reason`, reason);}
      
    await toBan.send(dmMsg);
    if(!client.config.debugMode) await message.guild.ban(toBan);
    await message.guild.channels.find(`name`, settings.modLogChannel).send(modEmbed);
    await message.channel.send(`:white_check_mark: \`|\` ${bhEmote} **Banned user ${toBan.tag}**`);

  });
};

exports.conf = {
  enabled: false,
  guildOnly: true,
  aliases: [],
  permLevel: `Moderator`
};

exports.help = {
  name: `ban`,
  description: `Ban someone from the server`,
  usage: `ban <@user> [reason]`,
  category: `Moderation`
};