module.exports.run = async (client, message, args) => {
  var folder = args[0];
  var cmd = args[1];

  if(!folder) return message.channel.send(':x: **Missing a folder!**');
  if(!cmd) return message.channel.send(':x: **Missing command name!**');

  await client.loadCommand(folder, cmd)
    .then(() => message.channel.send(`:white_check_mark: **Loaded command ${folder}/${cmd}`))
    .catch(e => message.channel.send(`:x: **${e}**`));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['registercommand', 'addcommand', 'addcmd', 'register'],
  permLevel: 'Bot Owner'
};

exports.help = {
  name: 'registercmd',
  description: 'Register a command in the available commands',
  usage: 'registercmd <folder (no /)> <command name (no .js)>',
  category: 'System'
};