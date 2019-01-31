module.exports = async (client, channel) => {
  if(channel.type === 'dm') return;
  client.verbose(`Channel created: ${channel.name} (${channel.id}) | Guild: ${channel.guild.name} (${channel.guild.id})`);

  let role = await channel.guild.roles.find(g => g.name.toLowerCase() === 'muted');
  if (role === null) role = await channel.guild.createRole({ name: 'Muted', color: 'DARK_ORANGE', position: channel.guild.me.highestRole.position - 1 }, 'Guild setup!')
    .then(() => client.verbose(`channelCreate | Created muted role in ${channel.guild.name} (${channel.guild.id})`))
    .catch(e => client.verbose(e));

  if(channel.type === 'text') return channel.overwritePermissions(role.id, {SEND_MESSAGES: false, ADD_REACTIONS: false})
    .then(() => client.verbose(`channelCreate | Wrote permissions for text channel #${channel.name} (${channel.id}) in ${channel.guild.name} (${channel.guild.id})`))
    .catch(e => client.verbose(e));
  if(channel.type === 'voice') return channel.overwritePermissions(role.id, {CONNECT: false, SPEAK: false})
    .then(() => client.verbose(`channelCreate | Wrote permissions for voice channel ${channel.name} (${channel.id}) in ${channel.guild.name} (${channel.guild.id})`))
    .catch(e => client.verbose(e));
};