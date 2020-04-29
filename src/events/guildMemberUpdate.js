/* 
* All this file does is check if the owner is streaming.
* If they are streaming, the bot disables the status cycle and sets its activity to your stream.
* If they are finished streaming, the bot enables the cycle and it goes back to doing that.
*/

//let { enabled } = require('../util/statuses'); // eslint-disable-line no-unused-vars

module.exports = (client, oldMember, newMember) => {
  if(newMember.id !== client.config.ownerID) return;
  client.logger.verbose('Owner updated their status!');

  /* if(newMember.presence.game && newMember.presence.game.streaming) {
    enabled = false;
    clearTimeout(client.statusRotationInterval);

    client.user.setActivity(newMember.presence.game.name, { url: newMember.presence.game.url, type: 'STREAMING' });
    client.logger.verbose('I set my activity to your stream!');

  } else { enabled = true; client.statusRotationInterval; } */
};