/* eslint-disable */
const aki = require('aki-api');
const { MessageEmbed } = require('discord.js');
module.exports.run = async (client, message, args) => {
  aki.start('en', (resolve, err) => {
    if (err) { message.send('❌ **Sorry!** There was some error when starting the game. Please try again later.'); client.logger.error(err); }
    else {
      // START THE GAME

      const region = 'en';
      const session = resolve.session;
      const signature = resolve.signature;
      let step = 0;

      const reactionsObject = {
        '✅': 0, // Yes
        '❌': 1, // No
        '🤷': 2, // Don't Know
        '👍': 3, // Probably
        '👎': 4  // Probably Not
      };

      message.send(new MessageEmbed()
        .setColor(client.accentColor)
        .setTitle(resolve.question)
        .setDescription('✅ **Yes** | ❌ **No** | 🤷 **Don\'t Know** | 👍 **Probably** | 👎 **Probably Not**')
        .setFooter('React with 🛑 to stop')
      ).then(async msg => {

        await msg.react('✅');
        await msg.react('❌');
        await msg.react('🤷');
        await msg.react('👍');
        await msg.react('👎');

        const filter = (reaction, user) => ['✅', '❌', '🤷', '👍', '👎', '🛑'].includes(reaction.emoji.name) && user.id === message.author.id;
        const collector = msg.createReactionCollector(filter)
          .on('collect', async g => {
            if (['✅', '❌', '🤷', '👍', '👎'].includes(g._emoji.name)) {
              aki.step(region, session, signature, reactionsObject[g._emoji.name], step, (res, error) => {
                console.log(res.progress);
                console.log(`Region: ${region}\nSession: ${session}\nSignature: ${signature}\n0\nStep: ${step}`);
                //if (error) { message.send('❌ **There was an error.** Game ended.'); client.logger.error(error); return collector.emit('end'); }
                if (+res.progress >= 98) {
                  return aki.win(region, session, signature, step, (resolve, e) => {
                    console.log(resolve);
                    //if (e) { message.send('❌ **There was an error.** Game ended.'); client.logger.error(error); return collector.emit('end'); }
                    msg.edit(new MessageEmbed()
                      .setColor(client.accentColor)
                      .addField('I guess...', `**${resolve.answers[0].name}!** | ${resolve.answers[0].description}`)
                      .setImage(resolve.answers[0].absolute_picture_path)
                    );
                  });
                }
                step++;
                msg.edit(new MessageEmbed()
                  .setColor(client.accentColor)
                  .setTitle(res.nextQuestion)
                  .setDescription('✅ **Yes** | ❌ **No** | 🤷 **Don\'t Know** | 👍 **Probably** | 👎 **Probably Not**')
                  .setFooter('React with 🛑 to stop')
                );
              });
              msg.reactions.get(g._emoji.name).users.remove(message.author);
            } else if (g._emoji.name === '🛑') { collector.emit('end'); }
            else msg.reactions.get(g._emoji.name).users.remove(message.author);
          })
          .on('end', () => msg.reactions.removeAll());

      });
    }
  });
};

exports.conf = {
  enabled: false,
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