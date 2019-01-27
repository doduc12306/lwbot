module.exports = async (client, channel) => {
  if(channel.type === 'dm') return;

  let role = await channel.guild.roles.find(g => g.name.toLowerCase() === 'muted');
  if (role === null) role = await channel.guild.createRole({ name: 'Muted', color: 'DARK_ORANGE', position: channel.guild.me.highestRole.position - 1 }, 'Guild setup!').catch(() => {});

  if(channel.type === 'text') return channel.overwritePermissions(role.id, {SEND_MESSAGES: false, ADD_REACTIONS: false});
  if(channel.type === 'voice') return channel.overwritePermissions(role.id, {CONNECT: false, SPEAK: false});
};