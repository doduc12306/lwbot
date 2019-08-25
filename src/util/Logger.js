// Logger class for easy and aesthetically pleasing console logging

const chalk = require('chalk');
const moment = require('moment');
const config = require('../config');
const { mkdir, appendFile } = require('fs');

exports.log = (content, type = 'log') => {
  const timestamp = chalk.grey(`[${moment().format('MM/DD/YYYY HH:mm:ss')}]`);
  switch (type) {
    case 'log': {
      appendToLog('info', content, true, true);
      return console.log(`${timestamp} ${chalk.blue('info:')} ${content} `);
    }
    case 'warn': {
      appendToLog('warn', content, true, true);
      return console.warn(`${timestamp} ${chalk.yellow('warn:')} ${content} `);
    }
    case 'error': {
      if(content.stack || content.includes('\n')) content = content.stack || content;
      appendToLog('error', content, true, true);
      return console.error(`${timestamp} ${chalk.red('error:')} ${content.split('\n').join(`\n${timestamp} ${chalk.red('error: ')}`)} `);
    }
    case 'debug': {
      appendToLog('debug', content, false, true);
      if (config.debugMode) return console.log(`${timestamp} ${chalk.cyan('debug:')} ${chalk.gray(content)} `);
      break;
    }
    case 'verbose': {
      if (!['string', 'number'].includes(typeof content)) content = require('util').inspect(content, { depth: 0, colors: true });
      if(content.stack || content.includes('\n')) content = content.stack || content;
      appendToLog('verbose', content, false, true);
      if (config.verboseMode) return console.log(`${timestamp} ${chalk.gray('verbose:')} ${chalk.gray(content.split('\n').join(`\n${timestamp} ${chalk.gray('verbose: ')}`))} `);
      break;
    }
    case 'sqLog': {
      appendToLog('sqLog', content, false, true);
      if (config.sqLogMode) return console.log(`${timestamp} ${chalk.white.bgBlack('sqlog:')} ${chalk.gray(content)} `);
      break;
    }
    case 'cmd': {
      appendToLog('cmd', content, true, true);
      return console.log(`${timestamp} ${chalk.blue('cmd:')} ${content}`);
    }
    case 'ws': {
      appendToLog('ws', content, true, true);
      return console.log(`${timestamp} ${chalk.blue('ws:')} ${content}`);
    }
    case 'ready': {
      appendToLog('info', content, true, true);
      return console.log(`${timestamp} ${chalk.green('ready:')} ${chalk.green(content)}`);
    }
    case 'reconnecting': {
      appendToLog('info', content, true, true);
      return console.log(`${timestamp} ${chalk.yellow('reconnecting:')} ${content}`);
    }
    case 'disconnect': {
      appendToLog('info', content, true, true);
      return console.warn(`${timestamp} ${chalk.red('disconnect:')} ${content} `);
    }
    case 'resume': {
      appendToLog('info', content, true, true);
      return console.log(`${timestamp} ${chalk.green('resume:')} ${content}`);
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
exports.ws = (...args) => this.log(...args, 'ws');
exports.websocket = (...args) => this.log(...args, 'ws');

async function appendToLog(type, content, combined = true, combinedDebug = true) {
  if (config.noFileLog) return;

  const timestamp = moment().format('MM/DD/YYYY HH:mm:ss');
  const currentDayLog = new Date().toDateString().replace(/ +/g, '-'); // Gets current date

  await mkdir(`./logs/${currentDayLog}`, { recursive: true }, e); // Makes ../logs/ if it not already exist
  await appendFile(`./logs/${currentDayLog}/${type}.log`, `${timestamp} ${content}\n`, e);

  if (combined) await appendFile(`./logs/${currentDayLog}/combined.log`, `${timestamp} ${type.toUpperCase()} ${content}\n`, e);
  if (combinedDebug) await appendFile(`./logs/${currentDayLog}/combinedDebug.log`, `${timestamp} ${type.toUpperCase()} ${content}\n`, e);
}
exports.appendToLog = appendToLog; // Export it for other files' usage

function e(e) {
  if (e && e.code === 'EEXIST') return;
  if (e) console.error('Appendfile error: ' + e);
}