const { readFile } = require('fs-extra');

module.exports.run = async (client, message, args) => {
  const content = readFile('./util/dictionary.txt').then(words => words.toString().split('\n').map(word => word.toLowerCase()));
  const dictionary = await content;
  const wordsAlreadyUsed = [];
  let previousWord = '';
  let mode = 'easy';

  if (args.length === 0)
    return message.send('❌ `|` 🔠 **You didn\'t say what to do!** Possible options: `start`, `end`, `join`');
  if (!['start', 'end', 'join'].includes(args[0]))
    return message.send('❌ `|` 🔠 **Invalid option!** Possible options: `start`, `end`, `join`');

  if (args[0] === 'start') {
    if (message.guild.shiritori) {
      if (message.guild.shiritori.author !== message.author.id)
        return message.send('❌ `|` 🔠 **There\'s already a game of Shiritori in progress in this guild!**');

      if (message.guild.shiritori.players.length === 1)
        return message.send('❌ `|` 🔠 **You can\'t start a game with only yourself!**');

      else {
        message.send(`✅ \`|\` 🔠 **Game started with ${message.guild.shiritori.players.length} players!**`);
        return showRules();
      }
    }

    if (message.content.endsWith('--medium')) mode = 'medium';
    if (message.content.endsWith('--hard')) mode = 'hard';
    // Initialize
    message.guild.shiritori = {
      players: [message.author.id],
      author: message.author.id,
      started: false,
      words: 0,
      longestWord: '',
      lastPlay: 'valid',
      duration: 10000, // 10 seconds
      mode // easy, medium, or hard
    };
    return message.send(`✅ \`|\` 🔠 **Game initialized!** ${message.author.toString()}, when everyone is ready, type \`${message.guild.settings.prefix}shiritori start\` again to begin!\nEveryone else, type \`${message.guild.settings.prefix}shiritori join\` to join the game!\n${checkMode(mode)}`);
  }

  if (args[0] === 'end') {
    if (!message.guild.shiritori)
      return message.send('❌ `|` 🔠 **There isn\'t currently a game of Shiritori in progress in this guild!**');
    if (message.guild.shiritori.author !== message.author.id)
      return message.send('❌ `|` 🔠 **You cannot end this game because you didn\'t start it!**');

    // End game functionality here
    endGame('ended by host');
  }

  if (args[0] === 'join') {
    if (!message.guild.shiritori)
      return message.send('❌ `|` 🔠 **There isn\'t currently a game of Shiritori in progress in this guild!**');
    if (message.guild.shiritori.players.includes(message.author.id))
      return message.send('❌ `|` 🔠 **You\'ve already joined!**');

    message.guild.shiritori.players.push(message.author.id);
    return message.send(`✅ \`|\` 🔠 **You have joined the game!** Players: \`${message.guild.shiritori.players.length}\``);
  }

  async function showRules() {
    const rulesMsgRaw =
      'ℹ️ `|` 🔠 **RULES:**\n\n' +
      '`1)` The ending of the previous word **must** be the beginning of the next word.\n' +
      'For example: hel__lo__ -> __lo__we__r__ -> __r__acecar and so on.\n' +
      '`2)` You **cannot** use a word more than once. If you do, you will be disqualified.\n' +
      '`3)` Each player will say their word in turn.\n' +
      '`4)` Your word must be valid. So, no "aaa" or "iunhenliufcu".\n' +
      '`5)` Once it\'s your turn, you have 10 seconds to answer, or else you will be disqualified.\n' +
      '`6)` Proper nouns cannot be used. For example: "Lucy" or "Washington"\n\n' +
      // Gap in the message...
      '**All players must accept these rules by reacting with a ✅**\n' +
      'Once all players accept these rules, the game will begin.\n' +
      'You have one minute to accept.\n' +
      message.guild.shiritori.players.map(player => message.guild.members.cache.get(player).toString()).join(', ');

    let reactions = 0;
    // Display the rules of the game in case those playing are unfamiliar
    const rulesMsg = await message.send(rulesMsgRaw);
    const filter = (reaction, user) => reaction.emoji.name === '✅' && message.guild.shiritori.players.includes(user.id) && !user.bot;
    rulesMsg.createReactionCollector(filter, { time: 60000 })
      .on('collect', () => {
        reactions++;
        if (reactions === message.guild.shiritori.players.length) {
          message.guild.shiritori.started = true;
          startGame(dictionary);
        }
      })
      .on('end', () => {
        rulesMsg.reactions.removeAll();
      });
    await rulesMsg.react('✅');
  }

  async function startGame(dictionary) {
    previousWord = dictionary.randomElement();
    message.guild.shiritori.longestWord = previousWord;
    message.guild.shiritori.words++;

    const currentPlayer = message.guild.members.cache.get(message.guild.shiritori.players[0]);
    const response = await awaitReply(message, `🔠 **Here we go!**\nI'll start with a word: \`${previousWord}\`.\nHey ${currentPlayer.toString()}! **It's your turn!** (You have 10 seconds.)`, message.guild.shiritori.duration, currentPlayer);

    game(response, currentPlayer, dictionary);
  }

  async function game(response, currentPlayer, dictionary) {
    message.guild.shiritori.lastPlay = 'valid';
    if (!response) {
      message.guild.shiritori.players.shift();
      message.send(`❌ \`|\` 🔠 **Time's up, ${currentPlayer.toString()}!** You're disqualified!`);
      message.guild.shiritori.lastPlay = 'invalid';
    } else if (!dictionary.includes(response.toLowerCase())) {
      message.guild.shiritori.players.shift();
      message.send(`❌ \`|\` 🔠 **Hey! That word doesn't exist in our dictionary, ${currentPlayer.toString()}!** You're disqualified!`);
      message.guild.shiritori.lastPlay = 'invalid';
    } else if (!checkEnding(previousWord, response.toLowerCase())) {
      message.guild.shiritori.players.shift();
      message.send(`❌ \`|\` 🔠 **Hey! That word doesn't begin with the ending of the previous word, ${currentPlayer.toString()}!** You're disqualified!`);
      message.guild.shiritori.lastPlay = 'invalid';
    } else if (wordsAlreadyUsed.includes(response.toLowerCase())) {
      message.guild.shiritori.players.shift();
      message.send(`❌ \`|\` 🔠 **Hey! That word has already been used, ${currentPlayer.toString()}!** You're disqualified!`);
      message.guild.shiritori.lastPlay = 'invalid';
    }

    if (message.guild.shiritori.lastPlay === 'valid') {
      // If the response's word was longer than the recorded longest word, update it.
      if (response.length > message.guild.shiritori.longestWord.length) message.guild.shiritori.longestWord = response.toLowerCase();

      // Take the current player off the beginning of the list and tack them onto the end
      const lastPlayer = message.guild.shiritori.players.shift();
      message.guild.shiritori.players.push(lastPlayer);

      // Update how many words there have been in this session
      message.guild.shiritori.words++;
      if(message.guild.shiritori.mode === 'medium' && message.guild.shiritori.words % 20 === 0) message.guild.shiritori.duration = message.guild.shiritori.duration - 1000;
      if(message.guild.shiritori.mode === 'hard' && message.guild.shiritori.words % 10 === 0) message.guild.shiritori.duration = message.guild.shiritori.duration - 1000;

      // Push this word to the array of words that were already used in this session
      wordsAlreadyUsed.push(response.toLowerCase());

      previousWord = response.toLowerCase();
    }

    if (message.guild.shiritori.players.length === 1) {
      return endGame('winner');
    }

    currentPlayer = message.guild.members.cache.get(message.guild.shiritori.players[0]);
    const newWord = await awaitReply(message, `✅ \`|\`🔠 **Previous word:** \`${previousWord}\`.\nHey ${currentPlayer.toString()}! **It's your turn!** (You have ${message.guild.shiritori.duration / 1000} seconds.)`, message.guild.shiritori.duration, currentPlayer);
    game(newWord, currentPlayer, dictionary);
  }

  function endGame(reason) {
    if (reason === 'winner') {
      const winner = message.guild.members.cache.get(message.guild.shiritori.players[0]);
      message.send(`🏆 \`|\` 🔠 **We have a winner!** Congratulations, ${winner.toString()}\n📋 **Some stats:** Rounds: ${message.guild.shiritori.words} \`|\` Longest word: \`${message.guild.shiritori.longestWord}\` (${message.guild.shiritori.longestWord.length} characters)`);
    } else if (reason === 'ended by host') {
      message.send(`🔠 **Game ended.**\n📋 **Some stats:** Rounds: ${message.guild.shiritori.words} \`|\` Longest word: \`${message.guild.shiritori.longestWord}\` (${message.guild.shiritori.longestWord.length} characters)`);
    }

    delete message.guild.shiritori;
  }
};

function checkEnding(endingWord, nextWord) {
  let wordFragment = '';
  for (let i = 0; i < nextWord.length; i++) {
    wordFragment += nextWord[i];
    if (wordFragment === nextWord) break;

    if (endingWord.endsWith(wordFragment)) return true;
    else continue;
  }
  return false;
}

function checkMode(mode) {
  if(mode === 'easy') return ':gear: **EASY DIFFICULTY.** The duration to answer will **not** decrease.';
  else if(mode === 'medium') return ':warning: **MEDIUM DIFFICULTY.** The duration will decrease by 1 second every **20** words.';
  else if(mode === 'hard') return '💥 **HARD DIFFICULTY!** The duration will decrease by 1 second every **10** words.';
}

// This is almost exactly the same as client.awaitReply, but with a modified filter.
// This filter checks if the author is the player.
// And the limit is 10 seconds instead of 30.
async function awaitReply(msg, question, limit = 10000, player) {
  const filter = m => m.author.id === player.id;
  await msg.channel.send(question);
  try {
    const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
    return collected.first().content;
  } catch (e) {
    return false;
  }
}

exports.conf = {
  enabled: true,
  permLevel: 'User',
  aliases: [],
  guildOnly: true
};

exports.help = {
  name: 'shiritori',
  description: 'A Japanese game where the ending of one word is the beginning of the next',
  usage: 'shiritori <start / end / join> [--medium / --hard]',
  category: 'Fun'
};