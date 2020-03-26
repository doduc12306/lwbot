module.exports.run = (client, message, args) => {
  const command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
  if(!command) return message.send(':x: **This command doesn\'t exist!**');

  if(command.conf.enabled) return message.send('✅ **This command is enabled.**');
  
  let msg = ':x: **This command is disabled.**';

  if(command.conf.disabledReason) msg += `\n:gear: **Reason:** ${command.conf.disabledReason}`;

  message.send(msg);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User'
};

exports.help = {
  name: 'diagnose',
  description: 'See if a command is enabled/disabled',
  usage: 'diagnose <command>',
  category: 'System'
};