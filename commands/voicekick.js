const Sequelize = require(`sequelize`);
const Discord = require(`discord.js`);

module.exports.run = async (client, message, args) => {
  var modBase = await new Sequelize(`database`, `user`, `password`, {host: `localhost`,dialect: `sqlite`,storage: `databases/servers/${message.guild.id}.sqlite`});
  modBase = await modBase.define(`moderation`, {victim: {type: Sequelize.STRING,allowNull: false},moderator: {type: Sequelize.STRING,allowNull: false},type: {type: Sequelize.STRING,allowNull: false},reason: Sequelize.STRING,duration: Sequelize.STRING});
  await modBase.sync();

  var settings = client.settings.get(message.guild.id);

  var toBan = message.mentions.users.first();
  var toBanM = message.mentions.members.first();
  var reason = args.slice(1).join(` `);

  if(!message.guild.me.permissions.has(`MOVE_MEMBERS`)) return message.channel.send(`:x: \`|\` :boot: **I am missing permissions:** \`Move Members\``);
  if(!message.guild.me.permissions.has(`MANAGE_CHANNELS`)) return message.channel.send(`:x: \`|\` :boot: **I am missing permissions:** \`Manage Channels\` `);
  if(!message.member.permissions.has(`KICK_MEMBERS`)) return message.channel.send(`:x: \`|\` :boot: **You are missing permissions:** \`Kick Members\``);
  if(!toBan) return message.channel.send(`:x: \`|\` :boot: **You didn't mention someone to voicekick!**`);
  if(!message.member.voiceChannel) return message.channel.send(`:x: \`|\` :boot: **You are not in the voice channel!**`);
  if(!message.member.voiceChannel === toBanM.voiceChannel) return message.channel.send(`:x: \`|\` :boot: **You must be in the same voice channel as ${toBan.toString()}**`);
  
  await modBase.create({
    victim: toBan.id,
    moderator: message.author.id,
    type: `voicekick`
  }).then(async info => {
    var dmMsg = `:boot: **You were voicekicked from** \`${message.member.voiceChannel.name}\`, **in** \`${message.guild.name}\` \`|\` :bust_in_silhouette: **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;
      
    var modEmbed = new Discord.RichEmbed()
      .setThumbnail(toBan.avatarURL)
      .setColor(`0xA80000`)
      .setFooter(`ID: ${toBan.id} | Case: ${info.id}`)
      .addField(`Voicekicked User`, `${toBan.toString()} (${toBan.tag})`)
      .addField(`Moderator`, `${message.author.toString()} (${message.author.tag})`)
      .addField(`Channel:`, message.member.voiceChannel.name);
      
    if(reason) {dmMsg += `\n\n:gear: **Reason: \`${reason}\`**`; modEmbed.addField(`Reason`, reason); modBase.update({ reason: reason }, { where: {id: info.id }});}
      
    var vc = message.guild.createChannel('Voice Kick', 'voice');
    toBanM.setVoiceChannel(vc);
    vc.delete();
    toBan.send(dmMsg);
    message.guild.channels.find(`name`, settings.modLogChannel).send(modEmbed);
    await message.channel.send(`:white_check_mark: \`|\` :boot: **Voicekicked user \`${toBan.tag}\`**`);

  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: `Moderator`
};

exports.help = {
  name: `voicekick`,
  description: `Kick someone from the current voice channel`,
  usage: `voicekick <@user> [reason]`,
  category: `Moderation`
};