const Sequelize = require(`sequelize`);
const Discord = require(`discord.js`);

module.exports.run = async (client, message, args) => {
  var settings = client.settings.get(message.guild.id);
  var toWarn = message.mentions.users.first();
  var reason = args.slice(1).join(` `);

  if(!toWarn) return message.channel.send(`:x: \`|\` :warning: **You didn't mention someone to warn!**`);

  await message.guild.modbase.create({
    victim: toWarn.id,
    moderator: message.author.id,
    type: `warn`
  }).then(async info => {
    var dmMsg = `:warning: **You were warned in** \`${message.guild.name}\` \`|\` :bust_in_silhouette: **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;

    var modEmbed = new Discord.RichEmbed()
      .setThumbnail(toWarn.avatarURL)
      .setColor(`0xFFFF00`)
      .setFooter(`ID: ${toWarn.id} | Case: ${info.id}`)
      .addField(`Warned User`, `${toWarn.toString()} (${toWarn.tag})`)
      .addField(`Moderator`, `${message.author.toString()} (${message.author.tag})`);

    if(reason) {dmMsg += `\n\n:gear: **Reason: \`${reason}\`**`; modEmbed.addField(`Reason`, reason); message.guild.modbase.update({ reason: reason }, { where: {id: info.id }});}

    await toWarn.send(dmMsg);
    await message.guild.channels.find(`name`, settings.modLogChannel).send(modEmbed);
    await message.channel.send(`:white_check_mark: \`|\` :warning: **Warned user ${toWarn.tag}**`);

  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: `Moderator`
};

exports.help = {
  name: `warn`,
  description: `Warn someone`,
  usage: `warn <@user> [reason]`,
  category: `Moderation`
};