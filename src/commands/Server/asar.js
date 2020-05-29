const GuildSARs = require('../../dbFunctions/message/sar');

module.exports.run = async (client, message, role) => {
  const sar = new GuildSARs(message.guild.id);

  if (role.length === 0) return message.send(':x: `|` 📋 **You didn\'t give me a role to add!**');
  role = role.join(' ');

  try { message.functions.parseRole(role); } catch (e) { return message.send(`:x: \`|\` 📋 **${e}**`); }
  const sarRole = message.functions.parseRole(role);
  
  if(sarRole.managed) return message.send(':x: `|` 📋 **That role is managed by an integration and cannot be manually added!**');

  await sar.addRole(sarRole.id);

  message.send(`:white_check_mark: \`|\` 📋 **Added role** \`${sarRole.name}\``);
};

exports.conf = {
  enabled: true,
  aliases: ['addselfassignablerole'],
  guildOnly: true,
  permLevel: 'User'
};

exports.help = {
  name: 'asar',
  description: 'Add a self-assignable role to this server',
  usage: 'asar <role/role ID>',
  category: 'Server'
};