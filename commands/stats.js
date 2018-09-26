const { version } = require('discord.js');
const moment = require('moment');
const Discord = require('discord.js');
require('moment-duration-format');

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  message.channel.send(new Discord.RichEmbed()
    .setTitle('`Statistics`')
    .addField('Guilds', client.guilds.size, true)
    .addField('Users', client.users.size, true)
    .addField('Memory Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
    .addField('Uptime', `:robot: ${moment.duration(client.uptime).format('M [months] W [weeks] D [days], H [hrs], m [mins], s [secs]')}\n :desktop: ${require('child_process').execSync('uptime -p').toString().split('up')[1].trim()}`, true)
    .addField('Discord.js', `v${version}`, true)
    .addField('Node', process.version, true)
    .setColor(client.config.colors.green)
    .setTimestamp()
  );
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['uptime'],
  permLevel: 'User'
};

exports.help = {
  name: 'stats',
  category: 'Misc',
  description: 'Gives some useful bot statistics',
  usage: 'stats'
};
