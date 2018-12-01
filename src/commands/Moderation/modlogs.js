/* eslint-disable */
const Discord = require('discord.js');
module.exports.run = (client, message, args) => { // eslint-disable-line
  var user = message.mentions.users.first() ? message.mentions.users.first() : message.author;

  message.guild.modbase.findAll({where: {victim: user.id}}).then(logs => {
    var curPage = 0;
    var embed = new Discord.RichEmbed()
      .setColor(client.config.colors.green)
      .setTitle(`Modlogs for ${user.tag}`);

    if(logs.length === 0) return message.channel.send(embed.setDescription('No logs found'));
    if(logs.length <= 9) for (var data of logs) {
      var reason = data.dataValues.reason === null ? 'No reason given' : data.dataValues.reason;
      var mod = message.guild.members.get(data.dataValues.moderator).user
        ? message.guild.members.get(data.dataValues.moderator).user
        : client.users.get(data.dataValues.moderator)
          ? client.users.get(data.dataValues.moderator)
          : '[User not found]';
      embed.addField(`Case **${data.dataValues.id}** \`|\` **${data.dataValues.type.toProperCase()}**`, `**Reason:** ${reason}\n**Moderator:** ${mod.toString()}`);
    }
    else {

    }
    message.channel.send(embed);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'User',
  requiresEmbed: true
};

exports.help = {
  name: 'modlogs',
  description: 'Get the mod logs of yourself / a member',
  usage: 'modlogs [@user]',
  category: 'Moderation'
};