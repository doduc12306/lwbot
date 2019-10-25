const walk = require('walk');
const { join } = require('path');
const { promisify } = require('util');
let { readdir } = require('fs-extra');
readdir = promisify(readdir);
require('dotenv').config({ path: join(__dirname, '../../.env') });

// Bad practice, I know. But it's only for *this* file, and I don't think it'll cause any harm.
String.prototype.splice = function(idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};
process.env.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
  .splice(7, 0, '-');
process.env.DEBUG_TOKEN = process.env.DEBUG_TOKEN
  .splice(24, 0, '.')
  .splice(31, 0, '.');

module.exports = async client => {

  const start = new Date();

  client.CiFullTimer = () => setTimeout(() => {
    throw new Error('Something took too long.');
  }, 15000); // If anything takes more than 15 seconds, error and exit.

  // If ANYTHING errors, catch it and exit.
  try {
    // Start the timer
    client.CiFullTimer();

    // Walk through command files
    const cmdFiles = await walk.walk('./commands/', { followLinks: false, filters: ['Temp', '_Temp'] });
    client.logger.log('Loading commands...');
    await cmdFiles.on('file', async (root, fileStats, next) => {
      const cmdPath = require('os').platform().includes('win')
        ? root.substring(root.indexOf('commands\\') + 13) // Windows path finding
        : join(__dirname, root).substring(join(__dirname, root).indexOf('commands/') + 9); // Linux path finding

      const response = await client.loadCommand(cmdPath, fileStats.name);
      if (response) throw new Error(response);
      await next();
    });

    // Walk through event files
    await cmdFiles.on('end', async () => {
      await client.logger.log('All commands finished loading!');

      const evtFiles = await readdir('./events/');
      client.logger.log(`Loading a total of ${evtFiles.length} events.`);

      evtFiles.forEach(async file => {
        const eventName = file.split('.')[0];
        const event = require(`../events/${file}`);
        client.on(eventName, event.bind(null, client));
        await client.logger.log(`Loaded ${file}`);
      });

      await client.logger.log('All events finished loading!');
      
      // Major section complete, reset timer.
      clearTimeout(client.CiFullTimer);
      client.CiFullTimer();

      await client.logger.log('Creating permission levels');
      // Generate a cache of client permissions for pretty perms
      client.levelCache = {};
      for (let i = 0; i < client.config.permLevels.length; i++) {
        const thisLevel = await client.config.permLevels[i];
        client.levelCache[thisLevel.name] = await thisLevel.level;
      }

      // Major section complete, reset timer.
      clearTimeout(client.CiFullTimer);
      client.CiFullTimer();

      await client.logger.log('Logging in...');

      await client.login(process.env.DEBUG_TOKEN);
      // Will then move to ready file. When it's done, it will emit ciStep1
    });

    await client.on('ciStepGuildCreate', () => {
      // Major section complete, reset timer.
      clearTimeout(client.CiFullTimer);
      client.CiFullTimer();

      client.logger.log('CI GUILDCREATE STEP');
      client.logger.log('Testing guildCreate event');

      const guildObject = client.guilds.get('332632603737849856');
      client.emit('guildCreate', guildObject);
    });

    await client.on('ciStepChannelCreate', () => {
      // Major section complete, reset timer.
      clearTimeout(client.CiFullTimer);
      client.CiFullTimer();

      client.logger.log('CI CHANNELCREATE STEP');
      client.logger.log('Testing channelCreate event');

      const channelObject = client.guilds.get('332632603737849856').channels.get('583018344370929684');
      client.emit('channelCreate', channelObject);
    });

    await client.on('ciStepMessage', () => {
      // Major section complete, reset timer.
      clearTimeout(client.CiFullTimer);
      client.CiFullTimer();

      client.logger.log('CI MESSAGE STEP');
      client.logger.log('Testing message event');

      const messageObject = {
        content: '!w ping',
        guild: client.guilds.get('332632603737849856'),
        member: client.guilds.get('332632603737849856').members.get('394913903466905601'),
        author: client.user,
        channel: client.guilds.get('332632603737849856').channels.get('583018344370929684')
      };

      client.emit('message', messageObject);
    });

    await client.on('ciStepFinish', benchmarks => {
      // Major section complete, reset timer.
      clearTimeout(client.CiFullTimer);
      client.CiFullTimer();

      // Message event benchmarks output
      client.logger.verbose('MESSAGE BENCHMARKS:');
      client.logger.verbose(benchmarks);

      // Complete. Gracefully shut down the client, then exit the process.
      client.logger.log('CI test suite complete! Exiting...');
      client.destroy()
        .then(() => {
          client.logger.log(`Took ${new Date()-start} ms.`);
          process.exit();
        })
        .catch(e => { throw new Error(e); });
    });

  } catch(e) {
    console.error(e);
    process.exit(1);
  }

};