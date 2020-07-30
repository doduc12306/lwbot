const { MessageAttachment } = require('discord.js');
const attachment = new MessageAttachment('./util/mewhenbugs.mp4');
module.exports.run = (client, message) => {
  message.send(attachment);
};

exports.conf = {
  enabled: true,
  aliases: ['bugs', 'fuckbugs', 'angrycomputer', 'whymustgodforsakemelikethis', 'mewhentechnologywontdowhatiwantittodo'],
  guildOnly: false,
  permLevel: 'User',
  hidden: true
};

exports.help = {
  name: 'mewhenbugs',
  description: 'Me when there\'s a bug',
  usage: 'mewhenbugs',
  category: 'Misc'
};