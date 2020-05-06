/* eslint-disable */
//const { MessageEmbed } = require('discord.js');
const { readdirSync, writeFile, readFile, access, existsSync, mkdir, constants } = require('fs-extra');
const { join } = require('path');
const child_process = require('child_process');

//const brains = readdirSync('./brains/');
//const brainsWithoutJSON = brains.map(g => g.split('.json')[0]);
//const brainsDir = join(__dirname, '../../brains');

module.exports.run = async (client, message, [...IDs]) => {

  // Temporary directory for brains when they're being trained
  access(`./tmp/brain-${message.guild.id}.json`, constants.F_OK, err => {
    if(err) return false;
    else return message.send('❌ `|` 🧠 **This guild\'s network is already being trained!** ');
  });

  client.logger.verbose(IDs);
  if (IDs.length === 0) return message.send('❌ `|` 🧠 **You didn\'t give an ID / IDs of messages to add to the network!**');

  // Sort through and make sure all the messages provided actually exist
  const msgsThatDoExist = [];
  for (const id of IDs) {
    const msg = await message.channel.messages.fetch(id)
      .catch(e => { if (e.message === 'Unknown Message') return; else throw e; });

    if (msg) msgsThatDoExist.push(msg);
  }

  // If none of the messages exist, error
  if (msgsThatDoExist.length === 0) return message.send(`❌ \`|\` 🧠 **${IDs.length === 1 ? 'The message provided does not exist!' : 'One of the messages provided exist!'}** `);

  // If there's already a JSON file for the guild, load it in first
  if (brainsWithoutJSON.includes(message.guild.id)) message.guild.brain.fromJSON(`${brainsDir}/${message.guild.id}.json`);

  const trainingData = [];
  for (const msg of msgsThatDoExist) trainingData.push({ input: msg.content, output: 1 });

  const msg = await message.send('<a:loading:536942274643361794> `|` 🧠 **Training...**');

  access('./tmp/', accessErr => {
    if(accessErr && accessErr.code === 'ENOENT') {
      mkdir('./tmp/', mkdirError => {
        if(mkdirError) return msg.edit(`❌ \`|\` 🧠 **Error creating tmp directory:**\n\`${mkdirError}\``);
        client.logger.verbose('trainnetwork.js: Created temp directory at src/tmp');
      });
    }

    writeFile(`./tmp/brain-${message.guild.id}.json`, ' ', writeFileErr => {
      if(writeFileErr) return msg.edit(`❌ \`|\` 🧠 **Error writing to tmp file:**\n\`${writeFileErr}\``);
      client.logger.verbose(`trainnetwork.js: Wrote temp file: brain-${message.guild.id}.json`);
    }); 
  });

  trainBrain()
    .then(() => message.send('Training success.'))
    .catch(e => {
      client.logger.error(e);
      message.send('Training error. Check console');
    });

  function trainBrain() {
    return new Promise((resolve, reject) => {
      const dataToSend = {
        trainingData,
        guildID: message.guild.id,
        brain: message.guild.brain.toJSON()
      };
    
      const forkOptions = {
        serialization: 'json'
      };
      const child = child_process.fork('./util/trainbrain.js', null, forkOptions); // Create the child process
      child.send(dataToSend); // Send process information to the child process
    
      child.on('error', reject);
      child.on('message', resolve);
      child.on('exit', reject); // This rejects because the process isn't supposed to exit before a message is sent.
    });
  }

  /* 
  * TODO: https://github.com/BrainJS/brain.js/pull/382 
  * - PR creates .trainAsync on an LSTM NN.
  * Once this PR is accepted I won't have to worry about child processes anymore. It'll be async
  */
  // This is trainAsync because regular train locks the thread.
  //message.guild.brain.trainAsync(trainingData)
  //  .then(res => message.send(res))
  //  .catch(e => message.send(`❌ \`|\` 🧠 **There was an error training the brain:** \`${e}\``));
};

exports.conf = {
  enabled: false,
  aliases: ['tn'],
  permLevel: 'Moderator',
  guildOnly: true,
  requiresEmbed: true,
  disabledReason: 'See this issue: https://github.com/BrainJS/brain.js/issues/532'
};

exports.help = {
  name: 'trainnetwork',
  description: 'Add a message/messages to the neural network that detects bad messages - Message IDs must be in the same channel as the command',
  usage: 'trainnetwork <message ID / IDs>',
  category: 'Server'
};