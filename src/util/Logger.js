// Logger class for easy and aesthetically pleasing console logging

const chalk = require('chalk');
const moment = require('moment');
const config = require('../config');
const { mkdir, appendFile } = require('fs');

exports.log = (content, type = 'log') => {
  const timestamp = chalk.grey(`[${moment().format('MM/DD/YYYY HH:mm:ss')}]:`);
  switch (type) {
    case 'log': {
      appendToLog('info', content, true, true);
      return console.log(`${timestamp} ${chalk.bgBlue('INFO')} ${content} `);
    }
    case 'warn': {
      appendToLog('warn', content, true, true);
      return console.warn(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${chalk.yellow(content)} `);
    }
    case 'error': {
      appendToLog('error', content, true, true);
      return console.error(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${chalk.red(content)} `);
    }
    case 'debug': {
      appendToLog('debug', content, false, true);
      if (config.debugMode) return console.log(`${timestamp} ${chalk.white.bgCyan(type.toUpperCase())} ${chalk.gray(content)} `);
      break;
    }
    case 'verbose': {
      if (!['string', 'number'].includes(typeof content)) content = require('util').inspect(content, { depth: 0, colors: true });
      appendToLog('verbose', content, false, true);
      if (config.verboseMode) return console.log(`${timestamp} ${chalk.white.bgBlack(type.toUpperCase())} ${chalk.gray(content)} `);
      break;
    }
    case 'sqLog': {
      appendToLog('sqLog', content, false, true);
      if (config.sqLogMode) return console.log(`${timestamp} ${chalk.white.bgBlack(type.toUpperCase())} ${chalk.gray(content)} `);
      break;
    }
    case 'cmd': {
      appendToLog('cmd', content, true, true);
      return console.log(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`);
    }
    case 'ready': {
      appendToLog('info', content, true, true);
      return console.log(`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${chalk.green(content)}`);
    }
    case 'reconnecting': {
      appendToLog('info', content, true, true);
      return console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content}`);
    }
    case 'disconnect': {
      appendToLog('info', content, true, true);
      return console.warn(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
    }
    case 'resume': {
      appendToLog('info', content, true, true);
      return console.log(`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${content}`);
    }
    default: throw new TypeError('Logger type must be either warn, debug, log, ready, cmd or error.');
  }
};

exports.error = (...args) => this.log(...args, 'error');
exports.warn = (...args) => this.log(...args, 'warn');
exports.debug = (...args) => this.log(...args, 'debug');
exports.cmd = (...args) => this.log(...args, 'cmd');
exports.debug = (...args) => this.log(...args, 'debug');
exports.verbose = (...args) => this.log(...args, 'verbose');
exports.sqLog = (...args) => this.log(...args, 'sqLog');

async function appendToLog(type, content, combined = true, combinedDebug = true) {
  const timestamp = moment().format('MM/DD/YYYY HH:mm:ss');
  const currentDayLog = new Date().toDateString().replace(/ +/g, '-'); // Gets current date

  await mkdir(`./logs/${currentDayLog}`, { recursive: true }, e); // Makes ../logs/ if it not already exist
  await appendFile(`./logs/${currentDayLog}/${type}.log`, `${timestamp} ${content}\n`, e);

  if (combined) await appendFile(`./logs/${currentDayLog}/combined.log`, `${timestamp} ${type.toUpperCase()} ${content}\n`, e);
  if (combinedDebug) await appendFile(`./logs/${currentDayLog}/combinedDebug.log`, `${timestamp} ${type.toUpperCase()} ${content}\n`, e);

  function e(e) { if(e) console.error('Appendfile error:' + e); }
}