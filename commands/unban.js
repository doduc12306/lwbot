const Sequelize = require(`sequelize`);
const Discord = require(`discord.js`);

module.exports.run = async (client, message, args) => {
  try {
    var modBase = await new Sequelize(`database`, `user`, `password`, {host: `localhost`,dialect: `sqlite`,storage: `databases/servers/${message.guild.id}.sqlite`});
    modBase = await modBase.define(`moderation`, {victim: {type: Sequelize.STRING,allowNull: false},moderator: {type: Sequelize.STRING,allowNull: false},type: {type: Sequelize.STRING,allowNull: false},reason: Sequelize.STRING,duration: Sequelize.STRING});
    await modBase.sync();

    var settings = client.settings.get(message.guild.id);
    var reason = args.slice(1).join(` `);
    var unBanHammer = `<:unbanhammer:459404085301346304>`;

    if(!message.guild.me.permissions.has(`BAN_MEMBERS`)) return message.channel.send(`:x: \`|\` ${unBanHammer} **I am missing permissions:** \`Ban Members\``);
    if(!message.member.permissions.has(`BAN_MEMBERS`)) return message.channel.send(`:x: \`|\` ${unBanHammer} **You are missing permissions:** \`Ban Members\``);
    if(!args[0]) return message.channel.send(`:x: \`|\` ${unBanHammer} **You didn't give the ID of someone to unban!**`);
    await client.fetchUser(args[0]).catch(e => message.channel.send(`:x: \`|\` ${unBanHammer} **I could not find that user!**`));

    var toUnban = await client.fetchUser(args[0]);

    const input = await modBase.create({
      victim: toUnban.id,
      moderator: message.author.id,
      type: `unban`
    }).then(async info => {
      if(reason) modBase.update({ reason: reason }, { where: {id: info.id }});
      
      var modEmbed = new Discord.RichEmbed()
        .setThumbnail(toUnban.avatarURL)
        .setColor(client.config.colors.green)
        .setAuthor(`Unbanned ${toUnban.tag} (${toUnban.id})`)
        .setFooter(`ID: ${toUnban.id} | Case: ${info.id}`)
        .addField(`User`, `${toUnban.toString()} (${toUnban.tag})`)
        .addField(`Moderator`, `${message.author.toString()} (${message.author.tag})`);
      
      if(reason) modEmbed.addField(`Reason`, reason);
      
      if(!client.config.debugMode) await message.guild.unban(toUnban.id);
      await message.guild.channels.find(`name`, settings.modLogChannel).send(modEmbed);
      await message.channel.send(`:white_check_mark: \`|\` ${unBanHammer} **Unbanned user ${toUnban.tag}**`);

    });
  } catch (e) {console.log(e);}
  
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [`pardon`],
  permLevel: `Moderator`
};

exports.help = {
  name: `unban`,
  description: `Unban someone`,
  usage: `unban <id> [reason]`,
  category: `Moderation`
};