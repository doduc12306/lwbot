module.exports = async (client, channel) => {
  if (channel.type === 'dm') return;

  // On guildCreate, the bot registers every new channel it sees as a channelCreate event.
  // This can be problematic when guildCreate is creating a muted role, and channelCreate is *simultaneously* trying to create overwrites for that role.
  // So, we wait at least a second for guildCreate to finish creating the muted role before this event does its thing.
  await client.wait(1000);

  client.logger.verbose(`Channel created: ${channel.name} (${channel.id}) | Guild: ${channel.guild.name} (${channel.guild.id})`);

  const role = await channel.guild.roles.find(g => g.name.toLowerCase() === 'muted');

  if (channel.type === 'text') {
    channel.overwritePermissions(role.id, { SEND_MESSAGES: false, ADD_REACTIONS: false })
      .then(() => client.logger.verbose(`channelCreate | Wrote permissions for text channel #${channel.name} (${channel.id}) in ${channel.guild.name} (${channel.guild.id})`))
      .catch(e => client.logger.verbose(e));
  } else if (channel.type === 'voice') {
    channel.overwritePermissions(role.id, { CONNECT: false, SPEAK: false })
      .then(() => client.logger.verbose(`channelCreate | Wrote permissions for voice channel ${channel.name} (${channel.id}) in ${channel.guild.name} (${channel.guild.id})`))
      .catch(e => client.logger.verbose(e));
  } else return client.logger.verbose('channelCreate | Category channel detected. Skipping...');

  if (client.config.ciMode) client.emit('ciStepMessage');
};