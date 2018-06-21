const Sequelize = require(`sequelize`);
const Discord = require(`discord.js`);
var parse = require(`parse-duration`);
const moment = require(`moment`);
require(`moment-duration-format`);

module.exports.run = async (client, message, args) => {
  var modBase = await new Sequelize(`database`, `user`, `password`, {host: `localhost`,dialect: `sqlite`,storage: `databases/${message.guild.id}.sqlite`});
  modBase = await modBase.define(`moderation`, {victim: {type: Sequelize.STRING,allowNull: false},moderator: {type: Sequelize.STRING,allowNull: false},type: {type: Sequelize.STRING,allowNull: false},reason: Sequelize.STRING,duration: Sequelize.STRING});
  await modBase.sync();

  var settings = client.settings.get(message.guild.id);

  var toBan = message.mentions.users.first();
  var toBanM = message.mentions.members.first();
  var reason = args.slice(2).join(` `);
  var duration = args[1];
  var bhEmote = `<:banhammer:459184964110385153>`;

  if(!message.guild.me.permissions.has(`BAN_MEMBERS`)) return message.channel.send(`:x: \`|\` ${bhEmote} **I am missing permissions:** \`Ban Members\``);
  if(!message.member.permissions.has(`BAN_MEMBERS`)) return message.channel.send(`:x: \`|\` ${bhEmote} **You are missing permissions:** \`Ban Members\``);
  if(!toBan) return message.channel.send(`:x: \`|\` ${bhEmote} **You didn't mention someone to ban!**`);
  if(!duration) return message.channel.send(`:x: \`|\` ${bhEmote} **You didn't set a duration!**`);
  if(toBan.bot) return message.channel.send(`:x: \`|\` ${bhEmote} **I cannot ban a bot!**`);
  if(!toBanM.bannable) return message.channel.send(`:x: \`|\` ${bhEmote} **This member could not be banned!**`);

  var durationMs = parse(duration);
  var durationHR = moment.duration(durationMs).format(`M [months] W [weeks] D [days], H [hrs], m [mins], s [secs]`); // HR = "Human Readable"

  if(durationMs === 0) return message.channel.send(`:x: \`|\` ${bhEmote} **${duration} is not a valid duration!**`);

  const input = await modBase.create({
    victim: toBan.id,
    moderator: message.author.id,
    type: `tempban`,
    duration: durationMs
  }).then(async info => {
    if(reason) modBase.update({ reason: reason }, { where: {id: info.id }});

    var dmMsg = `${bhEmote} ***You were tempbanned from*** \`${message.guild.name}\` ***for*** \`${durationHR}\` \`|\` :bust_in_silhouette: **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;
      
    var modEmbed = new Discord.RichEmbed()
      .setThumbnail(toBan.avatarURL)
      .setColor(`0xFF0000`)
      .setAuthor(`Banned ${toBan.tag} (${toBan.id})`)
      .setFooter(`ID: ${toBan.id} | Case: ${info.id}`)
      .addField(`User`, `${toBan.toString()} (${toBan.tag})`)
      .addField(`Moderator`, `${message.author.toString()} (${message.author.tag})`)
      .addField(`Duration`, durationHR);
      
    if(reason) {dmMsg += `\n\n:gear: **Reason:** \`${reason}\``; modEmbed.addField(`Reason`, reason);}
      
    await toBan.send(dmMsg);
    /* if(!client.config.debugMode) */ await message.guild.ban(toBan);
    await message.guild.channels.find(`name`, settings.modLogChannel).send(modEmbed);
    await message.channel.send(`:white_check_mark: \`|\` ${bhEmote} **Tempbanned user ${toBan.tag} for ${durationHR}**`);

    setTimeout(async () => {
      const unbanInput = await modBase.create({
        victim: toBan.id,
        moderator: client.user.id,
        type: `unban`,
      }).then(async info => {
        modEmbed = new Discord.RichEmbed()
          .setThumbnail(toBan.avatarURL)
          .setColor(client.config.colors.green)
          .setAuthor(`Unbanned ${toBan.tag} (${toBan.id})`)
          .setFooter(`ID: ${toBan.id} | Case: ${info.id}`)
          .addField(`User`, `${toBan.toString()} (${toBan.tag})`)
          .addField(`Moderator`, client.user.toString());

        if(!reason) {modBase.update({ reason: `Tempban auto unban` }, { where: {id: info.id}}); await modEmbed.addField(`Reason`, `Tempban unban`);}
        else {modBase.update({ reason: `${reason} | Tempban auto unban`}, { where: {id: info.id}}); await modEmbed.addField(`Reason`, `${reason} | Tempban unban`);}

        await message.guild.channels.find(`name`, settings.modLogChannel).send(modEmbed);

        message.guild.unban(toBan);
      });
    }, durationMs);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [`temporaryban`],
  permLevel: `Moderator`
};

exports.help = {
  name: `tempban`,
  description: `Temporarily ban someone from the server`,
  usage: `tempban <@user> <duration> [reason]\nDuration example: "1y2w8d4h5m10s" -> 1 year 2 weeks 8 days etc long`,
  category: `Moderation`
};