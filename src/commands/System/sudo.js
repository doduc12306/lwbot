module.exports.run = async (client, message, args) => {
  if (!args[0]) return message.send('❌ `|` ⚡ **Missing a user!**');
  if (!(/<@!?[0-9]+>/.test(args[0]))) return message.send(`❌ \`|\` ⚡ \`${args[0]}\` **is not a user!**`);

  const userID = args[0].startsWith('<@!') ? args[0].substring(3, args[0].length - 1) : args[0].substring(2, args[0].length - 1);

  const victim = {
    user: client.users.cache.get(userID),
    member: message.guild.members.cache.get(userID)
  }; // The same person, in different formats

  const sudoerPermLevel = client.permLevel(message.member);
  const victimPermLevel = client.permLevel(victim.member);

  if (victimPermLevel >= sudoerPermLevel) return message.send(`❌ \`|\` ⚡ **You cannot sudo this user because their permission level is higher than or equal to yours.**\n\t\tYour level: \`${sudoerPermLevel} - ${client.config.permLevels.find(l => l.level === sudoerPermLevel).name}\`\n\t\t${victim.user.username}'s level: \`${victimPermLevel} - ${client.config.permLevels.find(l => l.level === victimPermLevel).name}\``); // One big error message.

  if (!args[1]) return message.send('❌ `|` ⚡ **Missing command to emulate!**');

  message.author = await victim.user;
  message.member = await victim.member;
  message.content = await args.slice(1).join(' ');

  if (!message.content.startsWith(message.guild.settings.prefix))
    message.content = `${message.guild.settings.prefix}${message.content}`;

  client.emit('message', message);
  message.send(`✅ \`|\` ⚡ **Performed** \`${message.content}\` **on** \`${victim.user.tag}\`**.** `);
};

exports.conf = {
  enabled: true,
  aliases: ['su', 'run', 'runas'],
  guildOnly: true,
  permLevel: 'Bot Support'
};

exports.help = {
  name: 'sudo',
  description: 'Run a command as another user - requires server prefix',
  usage: 'sudo <@user> <command>',
  category: 'System'
};