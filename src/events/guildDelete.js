const { unlink } = require('fs-extra');
module.exports = (client, guild) => {
  client.logger.log(`Left guild ${guild.name} (${guild.id})`);

  unlink(`databases/servers/${guild.id}.sqlite`, err => {
    if(err && err.code === 'ENOENT') return client.logger.warn(`guildDelete: Database ${guild.id} did not exist to delete. Did sqWatchdog get to it before I did?`);
    if(err) throw err;

    client.logger.log(`Deleted guild database ${guild.id}.sqlite`);
  });

  delete client.settings.get(guild.id);
};