const cowsay = require('cowsay');
module.exports.run = (client, message, args) => {
  var content = args.slice(0).join(' ');
  if(!content) return message.channel.send('** **');

  message.channel.send(` \`root@lwbot-vps:~/lwbot-rewrite# cowsay ${content}\``)
    .then(async msg => {
      await client.wait(700);
      msg.edit(`\`\`\`\n${cowsay.say({text: content})}\n\`\`\``);
    })
};

exports.conf = {
  enabled: true,
  aliases: [],
  guildOnly: false,
  permLevel: `User`
};

exports.help = {
  name: 'cowsay',
  description: 'root@lwbot-vps:~/lwbot-rewrite# cowsay',
  usage: 'cowsay <string>',
  category: 'Fun'
};