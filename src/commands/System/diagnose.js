module.exports.run = (client, message, args) => {
  var command = client.commands.get(args[0]);

  if(command.conf.enabled) message.channel.send(':white_check_mark: **This command is enabled.**');
  else message.channel.send(':x: **This command is disabled.**');
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