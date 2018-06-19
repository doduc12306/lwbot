// This event executes when a new guild (server) is joined.

module.exports = (client, guild) => {

  // Thanks for this PSA, York.
  // This guild is full of userbots spamming commands. If this bot enters it, you'll see extreme performance issues.
  if(guild.id === `439438441764356097`) return guild.leave();
  // We need to add this guild to our settings!
  client.settings.set(guild.id, client.config.defaultSettings);
};
