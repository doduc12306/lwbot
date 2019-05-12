const Discord = require('discord.js');

module.exports.run = async (client, message) => {
  const xpSchema = require('../../dbFunctions/message/xp').functions.xpSchema(message.guild.id);

  xpSchema.findAll({
    order: [
      ['xp', 'DESC'],
      ['id', 'DESC']
    ]
  }).then(data => {
    const embed = new Discord.RichEmbed()
      .setColor(client.config.colors.green);
    for (const values of data) {
      if (data.indexOf(values) === 0) {
        if (message.guild.members.get(values.dataValues.user) === undefined) embed.addField(':crown: `[User Left]`', `XP: ${values.dataValues.xp} \`|\` Level: ${values.dataValues.level}`);
        else embed.addField(`:crown: ${message.guild.members.get(values.dataValues.user).user.tag}`, `XP: ${values.dataValues.xp} \`|\` Level: ${values.dataValues.level}`);
      } else if (data.indexOf(values) === 1) {
        if (message.guild.members.get(values.dataValues.user) === undefined) embed.addField(':second_place: `[User Left]`', `XP: ${values.dataValues.xp} \`|\` Level: ${values.dataValues.level}`);
        else embed.addField(`:second_place: ${message.guild.members.get(values.dataValues.user).user.tag}`, `XP: ${values.dataValues.xp} \`|\` Level: ${values.dataValues.level}`);
      } else if (data.indexOf(values) === 2) {
        if (message.guild.members.get(values.dataValues.user) === undefined) embed.addField(':third_place: `[User Left]`', `XP: ${values.dataValues.xp} \`|\` Level: ${values.dataValues.level}`);
        else embed.addField(`:third_place: ${message.guild.members.get(values.dataValues.user).user.tag}`, `XP: ${values.dataValues.xp} \`|\` Level: ${values.dataValues.level}`);
      }
      if (data.indexOf(values) <= 9 && data.indexOf(values) >= 3) {
        if (message.guild.members.get(values.dataValues.user) === undefined) embed.addField(`#${data.indexOf(values) + 1} \`[User Left]\``, `XP: ${values.dataValues.xp} \`|\` Level: ${values.dataValues.level}`);
        else embed.addField(`#${data.indexOf(values) + 1} ${message.guild.members.get(values.dataValues.user).user.tag}`, `XP: ${values.dataValues.xp} \`|\` Level: ${values.dataValues.level}`);
      }
    }
    message.send(embed);
  });
};

exports.conf = {
  enabled: false,
  permLevel: 'User',
  guildOnly: true,
  aliases: ['leaderboard', 'xplevels', 'xpleaderboard'],
  requiresEmbed: true
};

exports.help = {
  name: 'levels',
  description: 'Get the server\'s leaderboard',
  usage: 'levels',
  category: 'Server'
};