const userMethods = require('../../dbFunctions/client/user');

module.exports.run = async (client, message, args) => {
  const mood = args.join(' ');
  if(!mood) return message.send('❌ `|` ✏️ **You didn\'t give a new mood to set!**');

  const User = new userMethods(message.author.id);
  User.changeMood(mood);

  message.send(`✅ \`|\` ✏️ **Changed mood to** \`${mood}\``);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  permLevel: 'User',
  aliases: ['setmood']
};

exports.help = {
  name: 'mood',
  description: 'Set your mood',
  usage: 'mood <new mood>',
  category: 'User'
};