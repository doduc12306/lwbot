const logger = require('./util/Logger');
const fs = require('fs-extra');
if (process.version.slice(1).split('.')[0] < 12) {
  logger.error('Invalid Node.js version. Please choose a version greater than 11. (Preferrably v12)');
  process.exit(1);
}

fs.access('../.env', fs.constants.F_OK, err => { if(err) { logger.error('.env file does not exist.'); process.exit(1); } });

require('./startup').startup();

// lwbot-rewrite - Discord bot
// Copyright © Samir Buch 2017-2020
// License is applicable to all files and folders within directory