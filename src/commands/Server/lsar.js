const GuildSARs = require('../../dbFunctions/message/sar');

module.exports.run = async (client, message) => {
  const sar = new GuildSARs(message.guild.id);

  const roles = (await sar.sarRoles).map(g => message.guild.roles.cache.get(g)).map(g => g.name);
  if (roles.length === 0) return message.send(':x: `|` 📋 **There are no self-assignable roles for this server.**');

  message.send(`📋 **Self-assignable roles on this server:**\n\n${roles.map(g => `\`${g}\``).join(', ')}\n\n📋 **To add a role to yourself, type** \`${message.guild.settings['prefix']}iam <role>\``);
};

exports.conf = {
  enabled: true,
  aliases: ['listselfassignableroles', 'selfassignableroles'],
  guildOnly: true,
  permLevel: 'User'
};

exports.help = {
  name: 'lsar',
  description: 'List the self-assignable roles on this server',
  usage: 'lsar',
  category: 'Server'
};