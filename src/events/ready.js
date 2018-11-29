const { statuses } = require('../util/statuses');
module.exports = async client => {
  Array.prototype.randomElement = function(array) {
    return array[Math.floor(Math.random() * array.length)];
  };

  setInterval(() => {
    var randomPl = statuses.randomElement(statuses);
    client.user.setActivity(`${randomPl[0]} | !w help`, randomPl[1]);
  }, 60000);

  var after = new Date();
  client.startup = after - client.before;
  client.tags.sync();
  await client.wait(1000);
  client.logger.log(`${client.user.tag} | ${client.users.size} Users | ${client.guilds.size} Guilds | Took ${client.startup}ms`, 'ready');
};