const walk = require('walk');
const { join } = require('path');
const { promisify } = require('util');
let { readdir } = require('fs');
readdir = promisify(readdir);
require('dotenv').config({ path: join(__dirname, '../../.env') });

module.exports = client => {

  // If ANYTHING errors, catch it and exit.
  try {
    // Walk through command files
    const cmdFiles = walk.walk('../../commands/', { followLinks: false, filters: ['Temp', '_Temp'] });
    client.logger.log('Loading commands...');
    cmdFiles.on('file', (root, fileStats, next) => {
      const cmdPath = require('os').platform().includes('win')
        ? root.substring(root.indexOf('commands\\') + 13) // Windows path finding
        : join(__dirname, root).substring(join(__dirname, root).indexOf('commands/') + 9); // Linux path finding

      const response = client.loadCommand(cmdPath, fileStats.name);
      if (response) throw new Error(response);
      next();
    });

    // Walk through event files
    cmdFiles.on('end', async () => {
      await client.logger.log('All commands finished loading!');

      const evtFiles = await readdir('../../events/');
      client.logger.log(`Loading a total of ${evtFiles.length} events.`);

      evtFiles.forEach(async file => {
        const eventName = file.split('.')[0];
        const event = require(`../../events/${file}`);
        client.on(eventName, event.bind(null, client));
        await client.logger.log(`Loaded ${file}`);
      });

      await client.logger.log('All events finished loading!');
      await client.logger.log('Logging in...');

      client.login(process.env.DEBUG_TOKEN);
      // Will then move to ready file. When it's done, it will emit ciStep1
    });

    // Wait for ready to complete, then move on:
    client.on('ciStep1', () => {
      client.logger.log('Step 1 complete. Moving on...');
      client.logger.log('Testing message event');

      const messageObject = {
        content: '.w ping',
        guild: client.guilds.get('332632603737849856'),
        member: client.guilds.get('332632603737849856').members.get('394913903466905601')
      };
    });
  } catch(e) {
    throw new Error(e);
  }

};