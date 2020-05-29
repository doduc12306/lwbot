const GuildSARs = require('../../dbFunctions/message/sar');

module.exports.run = async (client, message, role) => {
  const sar = new GuildSARs(message.guild.id);

  if (role.length === 0) return message.send(':x: `|` 📋 **You didn\'t give me a role to add!**');
  role = role.join(' ');

  try { message.functions.parseRole(role); } catch (e) { return message.send(`:x: \`|\` 📋 **${e}**`); }
  const sarRole = message.functions.parseRole(role);
  
  const sarRoles = await sar.sarRoles;
  if(!sarRoles.includes(sarRole.id)) return message.send(':x: `|` 📋 **This role is not self-assignable!**');

  message.member.roles.add(sarRole);
  message.send(`:white_check_mark: \`|\` 📋 **Given role** \`${sarRole.name}\``);
};

exports.conf = {
  enabled: true,
  aliases: ['assignselfassignablerole'],
  guildOnly: true,
  permLevel: 'User'
};

exports.help = {
  name: 'iam',
  description: 'Give yourself a self-assignable role',
  usage: 'iam <role/role ID>',
  category: 'Server'
};