/* eslint-disable */
//const ascii = require('ascii-art');
module.exports.run = (client, message, args) => {
  const text = args.join(' ');
  if (!text) return message.send('❌ **No text to ascii-ify**');
  ascii.font(text, 'Doom', rendered => {
    message.send(`\`\`\`${rendered}\`\`\``, { split: true });
  });
};

exports.conf = {
  enabled: false,
  aliases: [],
  permLevel: 'User',
  guildOnly: false,
  disabledReason: 'This package unnecessarily requires a c++ package that I cannot build for some reason'
};

exports.help = {
  name: 'ascii',
  description: 'Turn your text into large text!',
  usage: 'ascii <text>',
  category: 'Fun'
};