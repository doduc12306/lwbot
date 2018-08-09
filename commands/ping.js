const Discord = require(`discord.js`);

module.exports.run = (client, message) => {
  var pings1 = client.pings.join(` `);
  var pings2 = pings1.split(` `);
  var ping1 = `${pings2[0]}ms`;
  var ping2 = `${pings2[1]}ms`;
  var ping3 = `${pings2[2]}ms`;
  var pings = `${ping1}, ${ping2}, ${ping3}`;

  message.channel.send(new Discord.RichEmbed()
    .addField(`:ping_pong: Ping`, `Pinging...`)
    .addField(`:left_right_arrow: Latency`, `Pinging...`)
    .addField(`:three: Last Three`, `Pinging...`)
    .setColor(54371)
  ).then(thismessage => {
    thismessage.edit(new Discord.RichEmbed()
      .addField(`:ping_pong: Ping`, Math.round(client.ping)+`ms`)
      .addField(`:left_right_arrow: Latency`, `${thismessage.createdAt-message.createdAt}ms`)
      .addField(`:three: Last Three`, pings)
      .setColor(54371)
    );
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: `User`
};

exports.help = {
  name: `ping`,
  category: `System`,
  description: `Ping pong! 🏓`,
  usage: `ping`
};