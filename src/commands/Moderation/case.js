const { RichEmbed } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

module.exports.run = async (client, message, args) => {
  const id = args[0];

  if(!id) return message.send('❌ **You didn\'t give me the case number to look up!**');

  const log = await message.guild.modbase.findOne({where: { id: id }});
  if(!log) return message.send(`❌ **I couldn't find case** \`${id}\`!`);

  const victim = client.users.get(log.dataValues.victim);
  const moderator = client.users.get(log.dataValues.moderator);

  const embed = new RichEmbed()
    .setTitle(`${log.dataValues.type.toProperCase()} | ${victim.tag} (${victim.id})`)
    .addField('User', `${victim} (${victim.tag})`)
    .addField('Moderator', `${moderator} (${moderator.tag})`)
    .addField('Reason', log.dataValues.reason)
    .setFooter(`ID: ${victim.id} | Case ${log.dataValues.id}`)
    .setThumbnail(victim.avatarURL)
    .setTimestamp(log.dataValues.updatedAt);

  switch(log.dataValues.type) {
    case 'ban': { embed.setColor(client.config.colors.red); break; }
    case 'hackban': { embed.setColor(client.config.colors.black); break; }
    case 'kick': { embed.setColor('0xff8e2b'); break; }
    case 'mute': { embed.setColor(client.config.colors.purple); break; }
    case 'softban': { embed.setColor('0x8C0F52'); break; }
    case 'tempban': { embed.setColor(client.config.colors.red); break; }
    case 'tempmute': { embed.setColor(client.config.colors.purple); break; }
    case 'unban': { embed.setColor(client.config.colors.accentColor); break; }
    case 'unmute': { embed.setColor(client.config.colors.accentColor); break; }
    case 'voiceban': { embed.setColor('0xA80000'); break; }
    case 'voicekick': { embed.setColor('0xA80000'); break; }
    case 'warn': { embed.setColor(client.config.colors.yellow); break; }
    case 'tempban unban': { embed.setColor(client.config.colors.accentColor); break; }
    case 'tempmute unmute': { embed.setColor(client.config.colors.accentColor); break; }
  }

  if (log.dataValues.duration !== null) embed.addField('Duration', moment.duration(+log.dataValues.duration).format('M [months] W [weeks] D [days], H [hrs], m [mins], s [secs]'));

  message.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'User'
};

exports.help = {
  name: 'case',
  description: 'Find the information of a mod case',
  usage: 'case <case number>',
  category: 'Moderation'
};