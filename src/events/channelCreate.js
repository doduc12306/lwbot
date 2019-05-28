module.exports = async (client, channel) => {
  if (channel.type === 'dm') return;

  // On guildCreate, the bot registers every new channel it sees as a channelCreate event.
  // This can be problematic when guildCreate is creating a muted role, and channelCreate is *simultaneously* trying to create overwrites for that role.
  // So, we wait at least a second for guildCreate to finish creating the muted role before this event does its thing.
  await client.wait(1000);

  client.verbose(`Channel created: ${channel.name} (${channel.id}) | Guild: ${channel.guild.name} (${channel.guild.id})`);

  const role = await channel.guild.roles.find(g => g.name.toLowerCase() === 'muted');

  if (channel.type === 'text') {
    channel.overwritePermissions(role.id, { SEND_MESSAGES: false, ADD_REACTIONS: false })
      .then(() => client.verbose(`channelCreate | Wrote permissions for text channel #${channel.name} (${channel.id}) in ${channel.guild.name} (${channel.guild.id})`))
      .catch(e => client.verbose(e));
  } else if (channel.type === 'voice') {
    channel.overwritePermissions(role.id, { CONNECT: false, SPEAK: false })
      .then(() => client.verbose(`channelCreate | Wrote permissions for voice channel ${channel.name} (${channel.id}) in ${channel.guild.name} (${channel.guild.id})`))
      .catch(e => client.verbose(e));
  } else if (channel.type === 'category') {
    // First, write perms to the category channel itself.
    await channel.overwritePermissions(role.id, { SEND_MESSAGES: false, ADD_REACTIONS: false })
      .then(() => {
        client.verbose(`channelCreate | Wrote permissions for category channel ${channel.name} (${channel.id}) in ${channel.guild.name} (${channel.guild.id})`);

        // Then, sync each child channel's permissions to this one.
        channel.children.forEach(async childChannel => {
          await childChannel.lockPermissions();
        });
      })
      .catch(e => client.verbose(e));
  } else return client.logger.error('Something went horribly wrong. You should not see this message. Contact my owner immediately.');

  if (client.config.ciMode) client.emit('ciStepMessage');
};