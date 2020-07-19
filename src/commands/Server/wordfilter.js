const GuildWordFilter = require('../../dbFunctions/message/wordFilter');
module.exports.run = async (client, message, [action, ...word]) => {
  if (!action) return message.send(':x: `|` 📃 **You didn\'t tell me what to do!**\nYou can ask me to `add` a word, `delete` a word, or `view` all words in the filter.');

  const wordFilter = new GuildWordFilter(message.guild.id);

  switch (action) {
    case 'addword':
    case 'add': {
      // Since it's [...word], it's an array containing the rest of the args array.
      if (word.length === 0) return message.send(':x: `|` 📃 **You didn\'t give me a word to add!**');
      else word = word.join(' ');

      wordFilter.addWord(word);

      return message.send(':white_check_mark: `|` 📃 **Added word to the filter!**');

    }
    // eslint-disable-next-line no-fallthrough
    case 'remove': // Alias!
    case 'removeword':
    case 'deleteword':
    case 'delete': {
      // Since it's [...word], it's an array containing the rest of the args array.
      if (word.length === 0) return message.send(':x: `|` 📃 **You didn\'t give me a word to delete!**');
      else word = word.join(' ');

      wordFilter.deleteWord(word)
        .then(() => {
          message.send(':white_check_mark: `|` 📃 **Deleted word from the filter!**');
        })
        .catch(e => {
          // RangeError because it checks the index of the word in the filter array
          if (e instanceof RangeError) return message.send(':x: `|` 📃 **That word didn\'t exist in the filter!**');
          else return message.send(`:x: \`|\` 📃 **Something went wrong:** \`${e}\``);
        });
    }
    // eslint-disable-next-line no-fallthrough
    case 'view': // Alias!
    default: {
      const words = await wordFilter.words;
      if (words.length === 0) return message.send('📃 **Currently not filtering any words.**');
      return message.send(`📃 **Currently filtered words:**\n\n${words.map(word => `\`${word}\``).join(', ')}`);
    }
  }
};

exports.conf = {
  enabled: true,
  aliases: [],
  guildOnly: true,
  permLevel: 'Moderator'
};

exports.help = {
  name: 'wordfilter',
  description: 'Manage the guild word filter',
  usage: 'wordfilter <add/delete/view> <word>',
  category: 'Server'
};