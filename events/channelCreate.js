module.exports = (client, channel) => {
  if(channel.type === 'dm') return;

  var role = channel.guild.roles.find('name', 'Muted') || channel.guild.roles.find('name', 'muted');

  if(!role) {
    role = channel.guild.createRole({name: 'Muted'});
    channel.guild.channels.forEach(g => {
      if(g.type === 'text') g.overwritePermissions(role.id, {SEND_MESSAGES: false, ADD_REACTIONS: false});
      if(g.type === 'voice') g.overwritePermissions(role.id, {CONNECT: false, SPEAK: false});
    });
  }

  if(channel.type === 'text') return channel.overwritePermissions(role.id, {SEND_MESSAGES: false, ADD_REACTIONS: false});
  if(channel.type === 'voice') return channel.overwritePermissions(role.id, {CONNECT: false, SPEAK: false});
};