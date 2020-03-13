/* eslint-disable */
const { MessageEmbed } = require('discord.js');
const { readdirSync, writeFile, readFile, access, constants } = require('fs-extra');

//var brains = readdirSync('./brains/');
//const brainsWithoutJSON = brains.map(g => g.split('.json')[0]);

module.exports.run = async (client, message, [...IDs]) => {
  try { require('worker_threads'); } catch (e) {
    message.send(':x: `|` <:nodelogo:660546806500818964> **Worker threads not enabled.**\nPlease restart the bot using the `--experimental-worker` runtime argument.\n(ex. `node --experimental-worker index.js`)')
    client.logger.error('Worker threads not enabled. \nPlease restart the process using the `--experimental-worker` runtime argument.\n(ex. `node --experimental-worker index.js`)\n-- Called from commands/Server/trainnetwork.js --');
    return false;
  }

  const worker = require('worker_threads'); // This is here and not at the beginning of the file because of the try statement

  // Temporary directory for brains when they're being trained
  access(`./tmp/brain-${message.guild.id}.json`, constants.F_OK, err => {
    if(err) return false;
    else return message.send(':x: `|` 🧠 **This guild\'s network is already being trained!** ');
  });

  client.logger.verbose(IDs);
  if (IDs.length === 0) return message.send(':x: `|` 🧠 **You didn\'t give an ID / IDs of messages to add to the network!**');

  // Sort through and make sure all the messages provided actually exist
  let msgsThatDoExist = [];
  for (const id of IDs) {
    const msg = await message.channel.messages.fetch(id)
      .catch(e => { if (e.message === 'Unknown Message') return; else throw e; });

    if (msg) msgsThatDoExist.push(msg);
  }

  // If none of the messages exist, error
  if (msgsThatDoExist.length === 0) return message.send(`:x: \`|\` 🧠 **${IDs.length === 1 ? 'The message provided does not exist!' : 'One of the messages provided exist!'}** `);

  // If there's already a JSON file for the guild, load it in first
  if (brainsWithoutJSON.includes(message.guild.id)) message.guild.brain.fromJSON(`${brainsDir}/${message.guild.id}.json`);

  const trainingData = [];
  for (const msg of msgsThatDoExist) trainingData.push({ input: msg.content, output: 1 });

  if (!worker.isMainThread) {
    client.logger.error('Somehow this command was called when not from the main thread. \nThis was not supposed to happen, under any circumstances. \nExiting...');
    process.exit(1);
  } else {
    const msg = await message.send('<a:loading:536942274643361794> `|` 🧠 **Training...**');

    trainBrain()
      .then(res => {
        const embed = new MessageEmbed()
          .setColor(client.config.colors.green)
          .setTitle('🧠 Network trained!')
          .setDescription(`Your message${msgsThatDoExist.length === 1 ? 's were' : ' was'} successfully added to the network that detects bad messages.`)
          .addField('Command message:', message.url)
          .setTimestamp();

        msg.edit(embed);
      })
      .catch(e => {
        const embed = new MessageEmbed()
          .setColor(client.config.colors.red)
          .setTitle('🧠 Error training network')
          .setDescription(`\`\`\`${e.stack}\`\`\``)
          .addField('Command message:', message.url)
          .setTimestamp();

        msg.edit(embed);
        client.logger.verbose(__filename);
        client.logger.error(`Error training brain:\n${e.stack}`);
      });

  }

  function trainBrain() {
    return new Promise((resolve, reject) => {
      const child = new worker.Worker('./util/trainbrain.js', {
        workerData: {
          id: message.guild.id,
          messages: trainingData
        }
      });

      child.on('online', () => client.logger.log(`Started worker, training brain for ${message.guild.id}.`))

      child.on('message', resolve);
      child.on('error', reject);
    });
  }

  /* 
  * TODO: https://github.com/BrainJS/brain.js/pull/382 
  * - PR creates .trainAsync on an LSTM NN.
  */

  // This is trainAsync because regular train locks the thread.
  //message.guild.brain.trainAsync(trainingData)
  //  .then(res => message.send(res))
  //  .catch(e => message.send(`:x: \`|\` 🧠 **There was an error training the brain:** \`${e}\``));
};

exports.conf = {
  enabled: false,
  aliases: ['tn'],
  permLevel: 'Moderator',
  guildOnly: true,
  requiresEmbed: true,
  disabledReason: 'See this issue: https://github.com/BrainJS/brain.js/issues/507'
};

exports.help = {
  name: 'trainnetwork',
  description: 'Add a message/messages to the neural network that detects bad messages - Message IDs must be in the same channel as the command',
  usage: 'trainnetwork <message ID / IDs>',
  category: 'Server'
};