/* eslint-disable require-atomic-updates */
const Discord = require('discord.js');
module.exports.run = (client, message) => {
  const user = message.mentions.users.first() ? message.mentions.users.first() : message.author;

  message.guild.modbase.findAll({ where: { victim: user.id } }).then(logs => {
    logs = logs.sort((a, b) => a.dataValues.id > b.dataValues.id ? -1 : 1);

    const embed = new Discord.RichEmbed()
      .setColor(client.accentColor)
      .setTitle(`Modlogs for ${user.tag}`);

    if (logs.length === 0) return message.send(embed.setDescription('No logs found'));
    if (logs.length <= 9) {
      for (const data of logs) {
        const reason = !data.dataValues.reason ? 'No reason given' : data.dataValues.reason;
        const mod = message.guild.members.get(data.dataValues.moderator).user
          ? message.guild.members.get(data.dataValues.moderator).user
          : client.users.get(data.dataValues.moderator)
            ? client.users.get(data.dataValues.moderator)
            : '[User not found]';
        embed.addField(`Case **${data.dataValues.id}** \`|\` **${data.dataValues.type.toProperCase()}**`, `**Reason:** ${reason}\n**Moderator:** ${mod.toString()}`, true);

      }
      message.send(embed);
    } else {
      let min = 0;
      let max = 8;
      let curPage = 1;

      let embed = new Discord.RichEmbed()
        .setColor(client.accentColor)
        .setTitle(`Modlogs for ${user.tag} | Page ${curPage}/${Math.ceil(logs.length / 9)}`);

      for (const data of logs) {
        const reason = !data.dataValues.reason ? 'No reason given' : data.dataValues.reason;
        const mod = message.guild.members.get(data.dataValues.moderator).user
          ? message.guild.members.get(data.dataValues.moderator).user
          : client.users.get(data.dataValues.moderator)
            ? client.users.get(data.dataValues.moderator)
            : '[User not found]';
        embed.addField(`Case **${data.dataValues.id}** \`|\` **${data.dataValues.type.toProperCase()}**`, `**Reason:** ${reason}\n**Moderator:** ${mod.toString()}`, true);
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
              if (min === 0 || curPage === 0) return msg.reactions.get('◀').remove(message.author);
              await client.wait(300);
              msg.reactions.get('◀').remove(message.author);
              min = await min - 9;
              max = await max - 9;
              curPage = await curPage - 1;

              embed = new Discord.RichEmbed()
                .setColor(client.accentColor)
                .setTitle(`Modlogs for ${user.tag} | Page ${curPage}/${Math.ceil(logs.length / 9)}`);

              for (const data of logs) {
                if (logs.indexOf(data) < min) continue;
                const reason = !data.dataValues.reason ? 'No reason given' : data.dataValues.reason;
                const mod = message.guild.members.get(data.dataValues.moderator).user
                  ? message.guild.members.get(data.dataValues.moderator).user
                  : client.users.get(data.dataValues.moderator)
                    ? client.users.get(data.dataValues.moderator)
                    : '[User not found]';
                embed.addField(`Case **${data.dataValues.id}** \`|\` **${data.dataValues.type.toProperCase()}**`, `**Reason:** ${reason}\n**Moderator:** ${mod.toString()}`, true);
                if (logs.indexOf(data) >= max) break;
              }
              msg.edit(embed);

            } else if (g._emoji.name === '▶') {
              await client.wait(300);
              msg.reactions.get('▶').remove(message.author);
              min = await min + 9;
              max = await max + 9;
              curPage = await curPage + 1;
              if (curPage > Math.ceil(logs.length / 9)) {
                await curPage--;
                min = min - 9;
                max = max - 9;
                msg.edit(embed.setFooter('This is the final page. There is no more data past this range.'));
                setTimeout(() => msg.edit(embed.setFooter('')), 5000);
                return;
              }

              embed = new Discord.RichEmbed()
                .setColor(client.accentColor)
                .setTitle(`Modlogs for ${user.tag} | Page ${curPage}/${Math.ceil(logs.length / 9)}`);

              for (const data of logs) {
                const index = logs.indexOf(data);
                if (index < min) continue;
                const reason = !data.dataValues.reason ? 'No reason given' : data.dataValues.reason;
                const mod = message.guild.members.get(data.dataValues.moderator).user
                  ? message.guild.members.get(data.dataValues.moderator).user
                  : client.users.get(data.dataValues.moderator)
                    ? client.users.get(data.dataValues.moderator)
                    : '[User not found]';
                embed.addField(`Case **${data.dataValues.id}** \`|\` **${data.dataValues.type.toProperCase()}**`, `**Reason:** ${reason}\n**Moderator:** ${mod.toString()}`, true);
              }
              msg.edit(embed);

            } else return;
          })
          .on('end', () => {
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