const Sequelize = require(`sequelize`);
const Discord = require(`discord.js`);

module.exports.run = async (client, message, args) => {
  try {
    var modBase = await new Sequelize(`database`, `user`, `password`, {host: `localhost`,dialect: `sqlite`,storage: `databases/servers/${message.guild.id}.sqlite`});
    modBase = await modBase.define(`moderation`, {victim: {type: Sequelize.STRING,allowNull: false},moderator: {type: Sequelize.STRING,allowNull: false},type: {type: Sequelize.STRING,allowNull: false},reason: Sequelize.STRING,duration: Sequelize.STRING});
    await modBase.sync();

    var settings = client.settings.get(message.guild.id);
    var reason = args.slice(1).join(` `);
    var bhEmote = `<a:hammerglitched:459396837741297671>`;

    if(!message.guild.me.permissions.has(`BAN_MEMBERS`)) return message.channel.send(`:x: \`|\` ${bhEmote} **I am missing permissions:** \`Ban Members\``);
    if(!message.member.permissions.has(`BAN_MEMBERS`)) return message.channel.send(`:x: \`|\` ${bhEmote} **You are missing permissions:** \`Ban Members\``);
    if(!args[0]) return message.channel.send(`:x: \`|\` ${bhEmote} **You didn't give the ID of someone to ban!**`);
    await client.fetchUser(args[0]).catch(e => message.channel.send(`:x: \`|\` ${bhEmote} **I could not find that user!**`));

    var toBan = await client.fetchUser(args[0]);

    await modBase.create({
      victim: toBan.id,
      moderator: message.author.id,
      type: `hackban`
    }).then(async info => {
      if(reason) modBase.update({ reason: reason }, { where: {id: info.id }});
      
      var modEmbed = new Discord.RichEmbed()
        .setThumbnail(toBan.avatarURL)
        .setColor(`0x000000`)
        .setAuthor(`Hackbanned ${toBan.tag} (${toBan.id})`)
        .setFooter(`ID: ${toBan.id} | Case: ${info.id}`)
        .addField(`User`, `${toBan.toString()} (${toBan.tag})`)
        .addField(`Moderator`, `${message.author.toString()} (${message.author.tag})`);
      
      if(reason) modEmbed.addField(`Reason`, reason);
      
      if(!client.config.debugMode) await message.guild.ban(toBan.id, {days: 2});
      await message.guild.channels.find(`name`, settings.modLogChannel).send(modEmbed);
      await message.channel.send(`:white_check_mark: \`|\` ${bhEmote} **Banned user \`${toBan.tag}\`**`);

    });
  } catch (e) {console.log(e);}
  
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [`idban`],
  permLevel: `Moderator`
};

exports.help = {
  name: `hackban`,
  description: `Ban someone who isn't in the server`,
  usage: `hackban <id> [reason]`,
  category: `Moderation`
};