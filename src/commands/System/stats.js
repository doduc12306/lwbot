const moment = require('moment');
const Discord = require('discord.js');
require('moment-duration-format');
const os = require('os');

exports.run = (client, message) => {
  const embed = new Discord.MessageEmbed()
    .setTitle('Statistics')
    .addField('Guilds', client.guilds.cache.size, true)
    .addField('Users', client.users.cache.size, true)
    .setColor(client.accentColor)
    .setTimestamp();

  embed.addField('Memory Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(os.totalmem() / 1000 / 1000 / 1000).toFixed(2)} GB (${(((process.memoryUsage().heapUsed / os.totalmem())) * 100).toFixed(3)}%)`, true);

  const botUptime = moment.duration(client.uptime).format('M [months] W [weeks] D [days], H [hours], m [mins], s [seconds]');
  const osUptime = moment.duration(os.uptime(), 'seconds').format('M [months] W [weeks] D [days], H [hours], m [mins], s [seconds]');
  embed.addField('Uptime', `:robot: ${botUptime}\n:desktop: ${osUptime}`);

  if(message.content.endsWith('--benchmarks')) embed.addField('Verbose benchmarks', `\`\`\`js\n${JSON.stringify(message.benchmarks, null, 2)}\n\`\`\``);

  message.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['uptime', 'status'],
  permLevel: 'User',
  requiresEmbed: true
};

exports.help = {
  name: 'stats',
  category: 'System',
  description: 'Gives some useful bot statistics',
  usage: 'stats'
};
