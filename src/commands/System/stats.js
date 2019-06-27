const moment = require('moment');
const Discord = require('discord.js');
require('moment-duration-format');

exports.run = (client, message) => {
  const embed = new Discord.RichEmbed()
    .setTitle('`Statistics`')
    .addField('Guilds', client.guilds.size, true)
    .addField('Users', client.users.size, true)
    .addField('Memory Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
    .setColor(client.config.colors.accentColor)
    .setTimestamp();

  const CU = moment.duration(client.uptime).format('M [months] W [weeks] D [days], H [hours], m [mins], s [seconds]'); // CU = client uptime

  if(require('os').platform() === 'darwin') embed.addField('Uptime', `🤖 : ${CU} | 🖥 : ${require('child_process').execSync('uptime').toString().split('load averages')[0]}`, true);
  else embed.addField('Uptime:', `🤖 : ${CU} | 🖥 : ${require('child_process').execSync('uptime -p').toString().split('up')[1]}`, true);

  if(client.config.verboseMode) embed.addField('Verbose Benchmarks', JSON.stringify(message.benchmarks));

  message.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['uptime'],
  permLevel: 'User',
  requiresEmbed: true
};

exports.help = {
  name: 'stats',
  category: 'System',
  description: 'Gives some useful bot statistics',
  usage: 'stats'
};
