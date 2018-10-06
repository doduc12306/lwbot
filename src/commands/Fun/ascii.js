var ascii = require('ascii-art');
module.exports.run = (client, message, args) => {
  var text = args.join(' ');
  if(!text) return message.channel.send(':x: **No text to ascii-ify**');
  ascii.font(text, 'Doom', rendered => {
    message.channel.send(`\`\`\`${rendered}\`\`\``, {split: true});
  });
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: 'User',
  guildOnly: false
};

exports.help = {
  name: 'ascii',
  description: 'Turn your text into large text!',
  usage: 'ascii <text>',
  category: 'Fun'
};