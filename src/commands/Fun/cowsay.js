module.exports.run = (client, message, args) => {
  const content = args.slice(0).join(' ');
  if(!content) return message.send('** **');

  require('child_process').exec(`cowsay ${content}`, (e, out, err) => {
    if(e || err) return message.send(`❌ **There was an error:** ${e || err}`);
    message.send(`\`\`\`\n${out}\n\`\`\``);
  });
};

exports.conf = {
  enabled: false,
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