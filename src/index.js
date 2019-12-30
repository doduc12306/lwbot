const logger = require('./util/Logger');
if (process.version.slice(1).split('.')[0] < 8 || process.version.slice(1).split('.')[0] > 11)
  return logger.error('Invalid Node.js version. Please choose a version from 8 to 11.');

require('./startup').startup();

// lwbot-rewrite - Discord bot
// Copyright © Samir Buch 2017-2019
// License is applicable to all files and folders within directory