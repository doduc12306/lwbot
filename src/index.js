if (process.version.slice(1).split('.')[0] < 8) throw new Error('Node 8.0.0 or higher is required. Update Node on your system.');

const Discord = require('discord.js');

const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);

var walk = require('walk');

const Enmap = require('enmap');

var { join } = require('path');
require('dotenv').config({ path: join(__dirname, '../.env') });

const client = new Discord.Client({
  fetchAllMembers: true,
  disabledEvents: ['TYPING_START', 'USER_NOTE_UPDATE', 'RELATIONSHIP_ADD', 'RELATIONSHIP_REMOVE'],
  ws: { large_threshold: 1000 }
});

client.config = require('./config.js');
client.logger = require('./util/Logger');
require('./modules/functions.js')(client);

client.commands = new Enmap();
client.aliases = new Enmap();
client.folder = new Enmap();

var options = { // walk module options
  followLinks: false
  , filters: ['Temp', '_Temp']
};

const init = async () => {
  if(client.config.debugMode) client.logger.warn('Debug mode enabled');
  client.before = new Date();
  // Here we load commands into memory, as a collection, so they're accessible
  // here and everywhere else.
  const cmdFiles = walk.walk('./commands/', options);
  client.logger.log('Loading commands...');
  cmdFiles.on('file', (root, fileStats, next) => { // eslint-disable-line no-unused-vars
    var cmdPath = join(__dirname, root);
    cmdPath = cmdPath.substring(cmdPath.indexOf('commands/') + 9);
    client.loadCommand(cmdPath, fileStats.name);
    next();
  });

  cmdFiles.on('end', async () => {
    await client.logger.log('All commands finished loading!');
    // Then we load events, which will include our message and ready event.
    const evtFiles = await readdir('./events/');
    client.logger.log(`Loading a total of ${evtFiles.length} events.`);
    evtFiles.forEach(async file => {
      const eventName = file.split('.')[0];
      const event = require(`./events/${file}`);
      client.on(eventName, event.bind(null, client));
      delete require.cache[require.resolve(`./events/${file}`)];
      await client.logger.log(`Loaded ${file}`);
    });
    await client.logger.log('All events finished loading!');

    // Generate a cache of client permissions for pretty perms
    client.levelCache = {};
    for (let i = 0; i < client.config.permLevels.length; i++) {
      const thisLevel = client.config.permLevels[i];
      client.levelCache[thisLevel.name] = thisLevel.level;
    }

    // Here we login the client.
    if (client.config.debugMode) client.login(process.env.DEBUG_TOKEN);
    else client.login(process.env.TOKEN);
  });

// End top-level async/await function.
};

init();