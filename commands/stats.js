const { version } = require(`discord.js`);
const moment = require(`moment`);
const Discord = require(`discord.js`);
require(`moment-duration-format`);

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  message.channel.send(new Discord.RichEmbed()
    .setTitle(`\`Statistics\``)
    .addField(`Mem Usage`, `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
    .addField(`Uptime`, moment.duration(client.uptime).format(`M [months] W [weeks] D [days], H [hrs], m [mins], s [secs]`))
    .addField(`Discord.js`, `v${version}`)
    .addField(`Node`, process.version)
    .setColor(client.config.colors.green)
  );
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: `User`
};

exports.help = {
  name: `stats`,
  category: `Misc`,
  description: `Gives some useful bot statistics`,
  usage: `stats`
};
