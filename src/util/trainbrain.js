/* eslint-disable */
const child_process = require('child_process');
const brainjs = require('brain.js');
//const { readFile, writeFile } = require('fs-extra');

process.on('message', message => {
  console.log('Child got message', message);

  const guildID = message.guildID;
  const messages = message.trainingData;
  console.log(messages);

  const brain = new brainjs.recurrent.LSTM({ hiddenLayers: [20, 20, 20] });
  brain.fromJSON(message.brain);

  brain.train(messages, {
    // Defaults values --> expected validation
    iterations: 20000, // the maximum times to iterate the training data --> number greater than 0
    errorThresh: 0.005, // the acceptable error percentage from training data --> number between 0 and 1
    log: info => sendMessageToParent({ type: 'progress', message: info }), // true to use console.log, when a function is supplied it is used --> Either true or a function
    logPeriod: 500, // iterations between logging out --> number greater than 0
    learningRate: 0.3, // scales with delta to effect training rate --> number between 0 and 1
    momentum: 0.1, // scales with next layer's change value --> number between 0 and 1
    callback: null, // a periodic call back that can be triggered while training --> null or function
    timeout: Infinity, // the max number of milliseconds to train for --> number greater than 0
  });

  const test = brain.run(messages[0].input);

  console.log('Output', test);
  sendMessageToParent({ type: 'finished', message: test, brain: brain.toJSON() })
});

function sendMessageToParent(message) {
  if (typeof message !== 'object') throw new TypeError('Type of message was not an object');

  process.send(message);
}

/*

const guildID = worker.workerData.id;
const messages = worker.workerData.messages;

const brainInBrains = readFile(`./brains/${guildID}.json`, (err, data) => {
  if(err && err.code === 'ENOENT') return false;
  else if(err && err.code !== 'ENOENT') { logger.error(`[WORKER-${worker.threadId}]: ${err.stack}`); process.exit(1); }

  return data;
});

logger.verbose(brainInBrains);

if(!brainInBrains) {
  writeFile(`./brains/${guildID}`, ' ' /* empty data to be overwritten later, err => {
    if(err) { logger.error(`[WORKER-${worker.threadId}]; ${err.stack}`); process.exit(1); }
  });
}

logger.verbose(worker.workerData);

const brain = new brainjs.recurrent.LSTM({ hiddenLayers: [20, 20, 20] });
if(brainInBrains) brain.fromJSON(brainInBrains);

brain.train(messages, {
  iterations: 20000, // the maximum times to iterate the training data --> number greater than 0
  errorThresh: 0.005, // the acceptable error percentage from training data --> number between 0 and 1
  log: log => logger.verbose(log), // true to use console.log, when a function is supplied it is used --> Either true or a function
  logPeriod: 100, // iterations between logging out --> number greater than 0
  learningRate: 0.3, // scales with delta to effect training rate --> number between 0 and 1
  momentum: 0.1, // scales with next layer's change value --> number between 0 and 1
  callback: null, // a periodic call back that can be triggered while training --> null or function
  callbackPeriod: 10, // the number of iterations through the training data between callback calls --> number greater than 0
  timeout: Infinity, // the max number of milliseconds to train for --> number greater than 0
}); */