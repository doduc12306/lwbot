module.exports.run = (client, message, args) => {
  var content = args.slice(0).join(' ');
  if(!content) return message.channel.send('** **');

  require('child_process').exec(`cowsay ${content}`, (e, out, err) => {
    if(e || err) return message.channel.send(`:x: **There was an error:** ${e || err}`);
    message.channel.send(`\`\`\`\n${out}\n\`\`\``);
  });
};

exports.conf = {
  enabled: true,
  aliases: [],
  guildOnly: false,
  permLevel: 'User'
};

exports.help = {
  name: 'cowsay',
  description: 'root@lwbot-vps:~/lwbot-rewrite/src/# cowsay',
  usage: 'cowsay <string>',
  category: 'Fun'
};