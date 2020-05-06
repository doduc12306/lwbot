module.exports.run = async (client, message, args) => {
  const commandsTable = require('../../dbFunctions/message/commands').functions.commandsSchema(message.guild.id); 

  if(!args[0]) return message.send('❌ **You didn\'t give me a command to diagnose.**');

  const command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
  if(!command) return message.send('❌ **This command doesn\'t exist!**');

  let cmdInDb;
  if (message.guild) {
    await commandsTable.findOne({ where: { command: command.help.name } }).then(data => {
      if (!data) cmdInDb === null;
      else cmdInDb = data.dataValues;
    });
  }

  if(command.conf.enabled && cmdInDb.enabled) return message.send('✅ **This command is enabled.**');

  if(command.conf.enabled && !cmdInDb.enabled) return message.send('❌ **This command is enabled globally, but disabled in this server.**');
  
  let msg = '❌ **This command is disabled globally.**';

  if(command.conf.disabledReason) msg += `\n⚙️ **Reason:** ${command.conf.disabledReason}`;

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