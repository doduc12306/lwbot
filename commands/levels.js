const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
  message.guild.xp.findAll({
    order: [
      ['xp', 'DESC'],
      ['id', 'DESC']
    ]
  }).then(data => {
    var embed = new Discord.RichEmbed()
      .setColor(client.config.colors.green);
    for (values of data) {
      if(data.indexOf(values) === 0){
        if (message.guild.members.get(values.dataValues.user) === undefined) embed.addField(`:crown: \`[User Left]\``, `XP: ${values.dataValues.xp} \`|\` Level: ${undefined}`);
        else embed.addField(`:crown: ${message.guild.members.get(values.dataValues.user).user.tag}`, `XP: ${values.dataValues.xp} \`|\` Level: ${undefined}`);
      } else if(data.indexOf(values) === 1){
        if (message.guild.members.get(values.dataValues.user) === undefined) embed.addField(`:second_place: \`[User Left]\``, `XP: ${values.dataValues.xp} \`|\` Level: ${undefined}`);
        else embed.addField(`:second_place: ${message.guild.members.get(values.dataValues.user).user.tag}`, `XP: ${values.dataValues.xp} \`|\` Level: ${undefined}`);
      } else if(data.indexOf(values) === 2){
        if (message.guild.members.get(values.dataValues.user) === undefined) embed.addField(`:third_place: \`[User Left]\``, `XP: ${values.dataValues.xp} \`|\` Level: ${undefined}`);
        else embed.addField(`:third_place: ${message.guild.members.get(values.dataValues.user).user.tag}`, `XP: ${values.dataValues.xp} \`|\` Level: ${undefined}`);
      }
      if(data.indexOf(values) <= 9 && data.indexOf(values) >= 3) {
        if (message.guild.members.get(values.dataValues.user) === undefined) embed.addField(`#${data.indexOf(values) + 1} \`[User Left]\``, `XP: ${values.dataValues.xp} \`|\` Level: ${undefined}`);
        else embed.addField(`#${data.indexOf(values) + 1} ${message.guild.members.get(values.dataValues.user).user.tag}`, `XP: ${values.dataValues.xp} \`|\` Level: ${undefined}`);
      }
    }
  message.channel.send(embed);
  });
};

exports.conf = {
  enabled: true,
  permLevel: 'Bot Owner',
  guildOnly: true,
  aliases: ['leaderboard', 'xplevels', 'xpleaderboard']
};

exports.help = {
  name: 'levels',
  description: 'xp',
  usage: 'xp',
  category: 'xp'
};