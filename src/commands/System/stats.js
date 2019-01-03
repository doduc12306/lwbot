const moment = require('moment');
const Discord = require('discord.js');
require('moment-duration-format');

exports.run = (client, message) => {
  message.send(new Discord.RichEmbed()
    .setTitle('`Statistics`')
    .addField('Guilds', client.guilds.size, true)
    .addField('Users', client.users.size, true)
    .addField('Memory Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
    .addField('Uptime', `:robot: ${moment.duration(client.uptime).format('M [months] W [weeks] D [days], H [hours], m [mins], s [secs]')}\n :desktop: ${require('child_process').execSync('uptime -p').toString().split('up')[1].trim()}`, true)
    .setColor(client.config.colors.green)
    .setTimestamp()
  );
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
