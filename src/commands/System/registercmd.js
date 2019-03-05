module.exports.run = async (client, message, args) => {
  const folder = args[0];
  const cmd = args[1];

  if(!folder) return message.send('❌ **Missing a folder!**');
  if(!cmd) return message.send('❌ **Missing command name!**');

  const response = await client.loadCommand(folder, cmd);
  if(response === false) return message.send(`✅ **Loaded ${args[0]}/${args[1]}**`);
  else message.send(`❌ **${response}**`);
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