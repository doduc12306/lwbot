const logger = require('./util/Logger');
const { version } = require('../package.json');

process.title = 'LWBot';

// if node.js version is less than 12, exit
if (process.version.slice(1).split('.')[0] < 12) {
  logger.error('Invalid Node.js version. Please choose a version greater than 11. (Preferrably v12)');
  process.exit(1);
}

// show help if the user requests it
if(process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`Help: lwbot-rewrite - v${version}`);
  console.log('Usage: node index.js [OPTIONS]');
  console.log(' ');

  console.log('   -d | --debug   : Run bot in debug mode, and log in to Discord with debug token.');
  console.log('   -v | --verbose : Output verbose information. Good for knowing what the bot does at all times.');
  console.log('   -s | --sqLog   : Show the logs coming from the database watchdog');
  console.log('        --ciMode  : Run the CI gamut. You probably won\'t need this.');
  console.log(' ');

  console.log('   --token <token>          : Manually use this token instead of the one supplied in .env');
  console.log('   --debugToken <token>     : Manually use this debug token instead of the one supplied in .env. Only works if -d is also enabled.');
  console.log('   --googleAPIKey <api key> : Manually use this API key instead of the one supplied in .env');
  console.log(' ');

  console.log('   --noFileLog           : Don\'t log everything to the day\'s file.');
  console.log('   --noFailoverWebsocket : Don\'t start the failover websocket.');
  console.log('   --noDbotsUpdate       : Don\'t post the bot\'s guild count to DBots every minute. Implicit if DBOTS_KEY is not set in .env');
  console.log('   --forceRoot           : **UNSUPPORTED** Force the bot to run as root even when it tells you NOT TO');
  console.log('   -h | --help           : Displays this message and exits');
  console.log(' ');
  console.log('\t\t\t(This BOT does NOT have Super Cow Powers.)');

  process.exit();
}

// if running as root, exit
if(process.geteuid() === 0 && !process.argv.includes('--forceRoot')) {
  logger.error('Do not run as root! This can cause file ownership issues');
  logger.error('If you are sure you know what you\'re doing, run again with --forceRoot.');
  process.exit(1);
} else if (process.geteuid() === 0 && process.argv.includes('--forceRoot')) {
  logger.warn(`

██╗    ██╗ █████╗ ██████╗ ███╗   ██╗██╗███╗   ██╗ ██████╗ 
██║    ██║██╔══██╗██╔══██╗████╗  ██║██║████╗  ██║██╔════╝ 
██║ █╗ ██║███████║██████╔╝██╔██╗ ██║██║██╔██╗ ██║██║  ███╗
██║███╗██║██╔══██║██╔══██╗██║╚██╗██║██║██║╚██╗██║██║   ██║
╚███╔███╔╝██║  ██║██║  ██║██║ ╚████║██║██║ ╚████║╚██████╔╝
 ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═══╝ ╚═════╝ 
 `);
  logger.warn('RUNNING AS ROOT!');
  logger.warn('THIS IS UNSUPPORTED!');
  logger.warn('I HOPE YOU KNOW WHAT YOU\'RE DOING!');
  logger.warn(' ');
  logger.warn('Starting in 10 seconds...');

  setTimeout(() => require('./startup').startup(), 10000); // Wait 10 seconds so the user knows what they're getting themselves into
} else require('./startup').startup();

// Copyright © Samir Buch 2017-2020
// License is applicable to all files and folders within directory