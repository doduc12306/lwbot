module.exports = async (client, channel) => {
  if(channel.type === 'dm') return;

  var role = await channel.guild.roles.find(role => role.name === 'Muted');
  if (role === null) {
    role = await channel.guild.roles.find(role => role.name === 'muted');
    if (role === null) {
      role = await channel.guild.createRole({ name: 'Muted', color: 'ORANGE' });
    }
  }

  if(channel.type === 'text') return channel.overwritePermissions(role.id, {SEND_MESSAGES: false, ADD_REACTIONS: false});
  if(channel.type === 'voice') return channel.overwritePermissions(role.id, {CONNECT: false, SPEAK: false});
};