const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const userFunction = require('../../dbFunctions/client/user');
module.exports.run = (client, message, args) => {
  let bet = args[0];
  if (!bet) bet = 0;
  if (bet && isNaN(bet)) return message.send(`❌ \`|\` ❔ \`${bet}\` **isn't a valid amount!**`);

  return fetch('http://jservice.io/api/random')
    .then(res => res.json())
    .then(async res => {
      res = res[0];

      const cubitsValue = res.value / 2 + bet;

      const response = await client.awaitReply(message, new MessageEmbed()
        .setColor(client.accentColor)
        .addField('Question', res.question)
        .addField('Category', res.category.title.toProperCase())
        .addField('Reward', `${cubitsValue}${bet ? '(Initial value + bet)' : ''}`)
        .setFooter('You have 30 seconds.')
      );

      const answer = clean(res.answer);

      const User = new userFunction(message.author.id);

      if (response === false) { // If time runs out
        User.changeBalance('subtract', cubitsValue);
        return message.send(`❌ \`|\` ❔ **Time's up!** You have lost \`${cubitsValue}\` Cubits.\n🔷 **The correct answer was:** ${answer}`);
      }

      if (response.toLowerCase() === answer.toLowerCase()) {
        User.changeBalance('add', cubitsValue);
        return message.send(`✅ \`|\` ❔ **You got it right!** You have been awarded \`${cubitsValue}\` Cubits.`);
      } else {
        User.changeBalance('subtract', cubitsValue);
        message.send(`❌ \`|\` ❔ **You got it wrong!** You have lost \`${cubitsValue}\` Cubits.\n🔷 **The correct answer was:** ${answer}`);
      }
    })
    .catch(e => {
      client.logger.error(e);
      return message.send('❌ `|` ❔ **There was an error getting the trivia information.** Please try again later.');
    });
};

function clean(str) {
  return str.replace(/<\/?i>/gmi, '')
    .replace(/"/gmi, '')
    .replace(/^an? /gmi, '');
}

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: 'User',
  guildOnly: false,
  cooldown: 30000 // 30 seconds
};

exports.help = {
  name: 'trivia',
  description: 'Test your knowledge!',
  usage: 'trivia <bet>',
  category: 'Fun'
};