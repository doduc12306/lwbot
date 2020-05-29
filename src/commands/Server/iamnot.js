const GuildSARs = require('../../dbFunctions/message/sar');

module.exports.run = async (client, message, role) => {
  const sar = new GuildSARs(message.guild.id);

  if (role.length === 0) return message.send(':x: `|` 📋 **You didn\'t give me a role to remove!**');
  role = role.join(' ');

  try { message.functions.parseRole(role); } catch (e) { return message.send(`:x: \`|\` 📋 **${e}**`); }
  const sarRole = message.functions.parseRole(role);
  
  const sarRoles = await sar.sarRoles;
  if(!sarRoles.includes(sarRole.id)) return message.send(':x: `|` 📋 **This role is not self-assignable!**');

  message.member.roles.remove(sarRole);
  message.send(`:white_check_mark: \`|\` 📋 **Removed role** \`${sarRole.name}\``);
};

exports.conf = {
  enabled: true,
  aliases: ['takeselfassignablerole'],
  guildOnly: true,
  permLevel: 'User'
};

exports.help = {
  name: 'iamnot',
  description: 'Remove a self-assignable role from yourself',
  usage: 'iamnot <role/role ID>',
  category: 'Server'
};