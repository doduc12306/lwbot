/* eslint-disable */
const Discord = require('discord.js');
module.exports.run = (client, message, args) => {
  const user = message.mentions.users.first() ? message.mentions.users.first() : message.author;

  message.guild.modbase.findAll({where: {victim: user.id}}).then(logs => {
    logs = logs.sort((a,b) => a.id > b.id);

    let embed = new Discord.RichEmbed()
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
      embed.addField(`Case **${data.dataValues.id}** \`|\` **${data.dataValues.type.toProperCase()}**`, `**Reason:** ${reason}\n**Moderator:** ${mod.toString()}`, true);
    }
    else {
      let min = 0;
      let max = 8;
      let curPage = 1;

      let embed = new Discord.RichEmbed()
        .setColor(client.config.colors.green)
        .setTitle(`Modlogs for ${user.tag} | Page ${curPage}`);

      for(let data of logs) {
        var reason = data.dataValues.reason === null ? 'No reason given' : data.dataValues.reason;
        var mod = message.guild.members.get(data.dataValues.moderator).user
          ? message.guild.members.get(data.dataValues.moderator).user
          : client.users.get(data.dataValues.moderator)
            ? client.users.get(data.dataValues.moderator)
            : '[User not found]';
        embed.addField(`Case **${data.dataValues.id}** \`|\` **${data.dataValues.type.toProperCase()}**`, `**Reason:** ${reason}\n**Moderator:** ${mod.toString()}`, true);
        if(logs.indexOf(data) >= max) break;
      }

      message.channel.send(embed).then(async msg => {
        await msg.react('◀');
        await msg.react('🛑');
        await msg.react('▶');

        const filter = (reaction, user) => ['◀', '🛑', '▶'].includes(reaction.emoji.name) && user.id === message.author.id
        const collector = msg.createReactionCollector(filter, { time: 30000 })
          .on('collect', async g => {
            if(g._emoji.name === '🛑') return collector.emit('end');
            else if(g._emoji.name === '◀') {
              embed = new Discord.RichEmbed()
                .setColor(client.config.colors.green)
                .setTitle(`Modlogs for ${user.tag} | Page ${curPage}`);
              if(min === 0 || curPage === 1) return msg.reactions.get('◀').remove(message.author);
              client.wait(700);
              msg.reactions.get('◀').remove(message.author);
              min = await min - 9;
              max = await max - 9;
              curPage = await curPage - 1;

              for(let data of logs) {
                embed.addField(`Case **${data.dataValues.id}** \`|\` **${data.dataValues.type.toProperCase()}**`, `**Reason:** ${reason}\n**Moderator:** ${mod.toString()}`, true);
                if(logs.indexOf(data) <= min) break;
                if(logs.indexOf(data) >= max) break;
              }
              msg.edit(embed);
            } else if(g._emoji.name === '▶') {
              embed = new Discord.RichEmbed()
                .setColor(client.config.colors.green)
                .setTitle(`Modlogs for ${user.tag} | Page ${curPage}`);
              client.wait(700);
              msg.reactions.get('▶').remove(message.author);
              min = await min + 9;
              max = await max + 9;
              curPage = await curPage + 1;

              for(let data of logs) {
                embed.addField(`Case **${data.dataValues.id}** \`|\` **${data.dataValues.type.toProperCase()}**`, `**Reason:** ${reason}\n**Moderator:** ${mod.toString()}`, true);
                if(logs.indexOf(data) <= min) break;
                if(logs.indexOf(data) >= max) break;
              }
              msg.edit(embed);
            } else return;
          })
          .on('end', _ => {
            msg.clearReactions();
          });
      });
    }
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