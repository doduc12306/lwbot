const User = require('../../dbFunctions/client/user');
module.exports = {
  run: async (client, message) => {
    const user = message.mentions.users.first();

    if(!user) return message.send('❌ `|` ⬆ **You didn\'t mention a user to add reputation to.**');
    if(user.id === message.author.id) return message.send('❌ `|` ⬆ **You can\'t add reputation to yourself.**');

    const addRep = new User(user.id).changeReputation('add', 1);
    message.send(`⬆ **+1 reputation to** ${user}**!** Total: \`${await addRep}\``);
  },

  conf: {
    enabled: true,
    permLevel: 'User',
    aliases: ['reputation', 'addrep'],
    guildOnly: true,
    cooldown: 8.64e+7
  },

  help: {
    name: 'rep',
    description: 'Add a reputation point to a user',
    usage: 'rep <@user>',
    category: 'User'
  }
};