const Discord = require('discord.js');
module.exports.run = (client, message, args) => {
  const user = message.mentions.users.first() ? message.mentions.users.first() : message.author;

  message.guild.modbase.findAll({ where: { victim: user.id } }).then(logs => {
    logs = logs.sort((a, b) => a.dataValues.id > b.dataValues.id ? -1 : 1);

    const embed = new Discord.MessageEmbed()
      .setColor(client.accentColor)
      .setTitle(`Modlogs for ${user.tag}`);

    if (logs.length === 0) return message.send(embed.setDescription('No logs found'));
    if (logs.length <= 9) {
      for (const data of logs) {
        const reason = !data.dataValues.reason ? 'No reason given' : data.dataValues.reason;
        const mod = message.guild.members.cache.get(data.dataValues.moderator).user
          ? message.guild.members.cache.get(data.dataValues.moderator).user
          : client.users.cache.get(data.dataValues.moderator)
            ? client.users.cache.get(data.dataValues.moderator)
            : '[User not found]';
        embed.addField(`Case **${data.dataValues.id}**: **${data.dataValues.type.toProperCase()}**`, `**Reason:** ${reason}\n**Moderator:** ${mod.toString()}`, true);

      }
      message.send(embed);
    } else {
      let min = 0;
      let max = 8;
      let curPage = args[1] || 1;

      if(curPage !== 1) {
        max = curPage * 9 - 1;
        min = max - 8;
      }

      let embed = new Discord.MessageEmbed()
        .setColor(client.accentColor)
        .setTitle(`Modlogs for ${user.tag} | Page ${curPage}/${Math.ceil(logs.length / 9)}`);

      for (const data of logs) {
        if (logs.indexOf(data) < min) continue;
        const reason = !data.dataValues.reason ? 'No reason given' : data.dataValues.reason;
        const mod = message.guild.members.cache.get(data.dataValues.moderator).user
          ? message.guild.members.cache.get(data.dataValues.moderator).user
          : client.users.cache.get(data.dataValues.moderator)
            ? client.users.cache.get(data.dataValues.moderator)
            : '[User not found]';
        embed.addField(`Case **${data.dataValues.id}**: **${data.dataValues.type.toProperCase()}**`, `**Reason:** ${reason}\n**Moderator:** ${mod.toString()}`, true);
        if (logs.indexOf(data) >= max) break;
      }

      message.send(embed).then(async msg => {
        await msg.react('◀');
        await msg.react('🛑');
        await msg.react('▶');

        const filter = (reaction, user) => ['◀', '🛑', '▶'].includes(reaction.emoji.name) && user.id === message.author.id;
        const collector = msg.createReactionCollector(filter, { time: 120000 })
          .on('collect', async g => {
            if (g._emoji.name === '🛑') return collector.emit('end');
            else if (g._emoji.name === '◀') {
              if (min === 0 || curPage === 0) return msg.reactions.cache.get('◀').users.remove(message.author);
              await client.wait(300);
              msg.reactions.cache.get('◀').users.remove(message.author);
              min = min - 9;
              max = max - 9;
              curPage--;

              embed = new Discord.MessageEmbed()
                .setColor(client.accentColor)
                .setTitle(`Modlogs for ${user.tag} | Page ${curPage}/${Math.ceil(logs.length / 9)}`);

              for (const data of logs) {
                if (logs.indexOf(data) < min) continue;
                const reason = !data.dataValues.reason ? 'No reason given' : data.dataValues.reason;
                const mod = message.guild.members.cache.get(data.dataValues.moderator).user
                  ? message.guild.members.cache.get(data.dataValues.moderator).user
                  : client.users.cache.get(data.dataValues.moderator)
                    ? client.users.cache.get(data.dataValues.moderator)
                    : '[User not found]';
                embed.addField(`Case **${data.dataValues.id}**: **${data.dataValues.type.toProperCase()}**`, `**Reason:** ${reason}\n**Moderator:** ${mod.toString()}`, true);
                if (logs.indexOf(data) >= max) break;
              }
              msg.edit(embed);

            } else if (g._emoji.name === '▶') {
              await client.wait(300);
              msg.reactions.cache.get('▶').users.remove(message.author);
              min = min + 9;
              max = max + 9;
              curPage++;
              if (curPage > Math.ceil(logs.length / 9)) {
                curPage--;
                min = min - 9;
                max = max - 9;
                msg.edit(embed.setFooter('This is the final page. There is no more data past this range.'));
                setTimeout(() => msg.edit(embed.setFooter('')), 5000);
                return;
              }

              embed = new Discord.MessageEmbed()
                .setColor(client.accentColor)
                .setTitle(`Modlogs for ${user.tag} | Page ${curPage}/${Math.ceil(logs.length / 9)}`);

              for (const data of logs) {
                const index = logs.indexOf(data);
                if (index < min) continue;
                const reason = !data.dataValues.reason ? 'No reason given' : data.dataValues.reason;
                const mod = message.guild.members.cache.get(data.dataValues.moderator).user
                  ? message.guild.members.cache.get(data.dataValues.moderator).user
                  : client.users.cache.get(data.dataValues.moderator)
                    ? client.users.cache.get(data.dataValues.moderator)
                    : '[User not found]';
                embed.addField(`Case **${data.dataValues.id}**: **${data.dataValues.type.toProperCase()}**`, `**Reason:** ${reason}\n**Moderator:** ${mod.toString()}`, true);
              }
              msg.edit(embed);

            } else return;
          })
          .on('end', () => {
            msg.reactions.removeAll();
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