module.exports.run = (client, message, args) => {
  require(`child_process`)
    .exec(args.join(` `), (e, out, err) => {
      if (e) return console.error(e);
      if (err) return console.error(err);
      message.channel.send(`\`\`\`xl\n${out}\n\`\`\``);
    });
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: `Bot Owner`,
  guildOnly: false
};

exports.help = {
  name: `sys`,
  description: `Executes bash script`,
  category: `System`,
  usage: `sys <bash>`
};