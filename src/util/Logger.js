/*
Logger class for easy and aesthetically pleasing console logging
*/
const chalk = require('chalk');
const moment = require('moment');
const config = require('../config');

exports.log = (content, type = 'log') => {
  const timestamp = chalk.gray(`[${moment().format('MM/DD/YYYY HH:mm:ss')}]:`);
  switch (type) {
    case 'log': {
      return console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `);
    }
    case 'warn': {
      return console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${chalk.yellow(content)} `);
    }
    case 'error': {
      return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${chalk.red(content)} `);
    }
    case 'debug': {
      if(config.debugMode) return console.log(`${timestamp} ${chalk.white.bgCyan(type.toUpperCase())} ${chalk.italic.gray(content)} `);
      break;
    }
    case 'verbose': {
      if(!['string', 'number'].includes(typeof content)) content = require('util').inspect(content, {depth: 0, colors: true});
      if(config.verboseMode) return console.log(`${timestamp} ${chalk.white.bgBlack(type.toUpperCase())} ${chalk.italic.gray(content)} `);
      break;
    }
    case 'cmd': {
      return console.log(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`);
    }
    case 'ready': {
      return console.log(`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${chalk.green(content)}`);
    }
    case 'reconnecting': {
      return console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content}`);
    }
    case 'disconnect': {
      return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
    }
    case 'resume': {
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
