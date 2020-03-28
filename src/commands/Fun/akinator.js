const aki = require('aki-api');
const { MessageEmbed } = require('discord.js');
const users = new Set();
const regions = ['en', 'en2', 'ar', 'cn', 'de', 'es', 'fr', 'il', 'it', 'jp', 'kr', 'nl', 'pl', 'pt', 'ru', 'tr'];
const yes = '✅';
const no = '❌';
const unknown = '❓';
const probably = '🤔';
const probablyNot = '🚫';
const back = '⬅';
const stop = '🛑';
const maxSteps = 80;

module.exports.run = async (client, message, args) => {
  if (users.has(message.author.id)) {
    return await message.send(`❌ \`|\` **You already have a session started.** Please hit the ${stop} emoji to end.`);
  }

  message.react(client.emojis.cache.get('536942274643361794'));

  // get region if it exists
  let region = 'en';
  if (args.length >= 1) {
    const testRegion = args[0];
    const i = regions.findIndex(reg => testRegion === reg);

    if (i !== -1) {
      region = regions[i];
    }
  }

  // should probably fix this nesting
  let info = await aki.start(region).catch(e => client.logger.error(e));
  if (!info) {
    region = 'en2';
    info = await aki.start(region).catch(e => client.logger.error(e));
    if (!info) {
      region = 'en3';
      info = await aki.start(region).catch(e => client.logger.error(e));

      // if still no info, then we have no info.
      if (!info) {
        return await message.send('❌ **Aki servers are down :(**\n**Please check back later.**');
      }
    }
  }

  // variables to further help
  let loop = 0; let
    found = false;
  const str = `${yes} **Yes** **|** ${no} **No** **|** ${unknown} **I don't know** **|** ${probably} **Probably** **|** ${probablyNot} **Probably Not**\n${back}: **Back** **|** ${stop}: **Stop**`;

  let nextInfo = {};
  nextInfo.nextQuestion = str;

  // make the new embed to send
  const embed = new MessageEmbed()
    .setTitle(`Question 1: ${info.question}`)
    .setDescription(nextInfo.nextQuestion)
    .setColor('GOLD')
    .setFooter('Please answer within 60 seconds.');

  let myMessage = await message.send(embed);
  message.reactions.cache.get('536942274643361794').users.remove(client.user);

  await myMessage.react(yes);
  await myMessage.react(no);
  await myMessage.react(unknown);
  await myMessage.react(probably);
  await myMessage.react(probablyNot);
  await myMessage.react(back);
  await myMessage.react(stop);

  // create my filter
  const author = message.author.id;
  const filter = (reaction, user) => ([yes, no, unknown, probably, probablyNot, back, stop].includes(reaction.emoji.name))
    && user.id === author && !user.bot;

  // new reaction collector
  const collector = myMessage.createReactionCollector(filter);

  // add the user to the set so they can only have 1 session
  users.add(message.author.id);

  // refresh timer each message
  const timeout = setTimeout(() => collector.emit('end'), 6e4);

  // reaction collector functions
  const collectorFunction = async (r) => {
    // timeout to stop the collector (1 minute for each message)
    timeout.refresh();

    // after 1 second allow them to react
    setTimeout(async () => {
      let answerID;
      switch (r.emoji.name) {
        case yes:
          answerID = 0;
          break;
        case no:
          answerID = 1;
          break;
        case unknown:
          answerID = 2;
          break;
        case probably:
          answerID = 3;
          break;
        case probablyNot:
          answerID = 4;
          break;
        case back:
          answerID = 5;
          break;
        case stop:
          answerID = 6;
          break;
      }

      // back
      if (answerID === 5) {
        if (nextInfo.nextStep > 0) {
          nextInfo = await aki.back(region, info.session, info.signature, answerID, nextInfo.nextStep || 0);
        }
      }
      // stop
      else if (answerID === 6) {
        collector.emit('end');
        return;
      } else if (answerID != null) {
        // found
        if (found) {
          // we had the right answer
          if (answerID === 0) {
            // send message
            myMessage = await myMessage.edit(`Looks like I win again! This time after ${nextInfo.nextStep} steps. Thanks for playing!`, { embed });
            collector.emit('end');

            return;
          }
          // wrong answer
          if (answerID === 1) {
          }
          found = false; // not found, time to reset on our side
        }
        nextInfo = await aki.step(region, info.session, info.signature, answerID, nextInfo.nextStep || 0).catch(error => {
          client.logger.error(error);
          myMessage.edit('❌ **There was an error processing the next request. Game cancelled.**');
          collector.emit('end');
        });
      }

      // now that we have our new info, we must decide whether to end the game (they won) or continue
      // they won
      if (nextInfo.progress >= 78 && loop > 3 || nextInfo.nextStep >= 79) {
        // reset loop to ensure we are not getting the same answer (we have to keep trying)
        loop = 0;

        // try to win, error either goes again or ends
        const win = await aki.win(region, info.session, info.signature, nextInfo.nextStep || 0).catch(async (error) => {
          client.logger.error(error);

          // can continue (max of 80 steps)
          if (nextInfo.nextStep < maxSteps) {
            nextInfo = await aki.step(region, info.session, info.signature, answerID, nextInfo.nextStep || 0);
          } else {
            myMessage = await myMessage.edit('❌ `|` **Akinator error has occurred.**', { embed: null });
            collector.emit('end');
          }
        });

        // found some answers
        if (win.answers != null && win.answers.length > 0) {
          found = true;
          const { name } = win.answers[0];
          const image = win.answers[0].absolute_picture_path;
          const description = win.answers[0].description || '';

          if (nextInfo.nextStep >= 79) {
            embed.setTitle('My Final Guess is... 🤔');
          } else {
            embed.setTitle('I\'m thinking of... 🤔');
          }

          // add description and image
          embed.setDescription(`**${name}**\n**${description}**\n${str}`);
          if (image != null) {
            embed.setImage(image);
          }

          myMessage = await myMessage.edit('', { embed });

          // done with the game, we can't do anything else.
          if (nextInfo.nextStep >= 79) {
            collector.emit('end');
          }
        }
      }
      // keep going (didn't win or get close yet)
      else {
        loop++;
        embed.setTitle(`Question ${nextInfo.nextStep + 1}: ${nextInfo.nextQuestion}`)
          .setDescription(str)
          .setImage(undefined);
        myMessage = await myMessage.edit('', { embed });
      }
    }, 1000);

    myMessage.reactions.cache.get(r._emoji.name).users.remove(message.author);
  };

  // assign the function
  collector.on('collect', collectorFunction);

  collector.on('end', () => {
    // remove the user from the set
    users.delete(message.author.id);
    if (myMessage != null && !myMessage.deleted) {
      myMessage.reactions.removeAll().catch(e => client.logger.error(e));
    }
  });
};

exports.conf = {
  enabled: true,
  permLevel: 'User',
  aliases: ['aki'],
  guildOnly: false
};

exports.help = {
  name: 'akinator',
  description: 'Play a game of Akinator!',
  usage: 'akinator',
  category: 'Fun'
};