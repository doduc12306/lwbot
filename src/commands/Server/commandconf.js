module.exports.run = async (client, message, [option, command, ...permlevel]) => {
  const commandsTable = require('../../dbFunctions/message/commands').functions.commandsSchema(message.guild.id);

  if (!option || !['enable', 'disable', 'setperm'].includes(option)) return message.send('❌ `|` ⚙️ **Invalid option!** Accepted values: `enable`, `disable`, or `setperm`');
  if (!command) return message.send('❌ `|` ⚙️ **You didn\'t give a command to edit!**');

  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if (!cmd) return message.send(`❌ \`|\` ⚙️ \`${command}\` **does not exist, nor is it an alias!**`);
  if (!cmd.conf.enabled) return message.send(`❌ \`|\` ⚙️ \`${command}\` **has been disabled globally by the bot owner!**`);

  if (['commandconf'].includes(cmd.help.name)) return message.send(`❌ \`|\` ⚙️ \`${command}\` **cannot be edited!**`); // A list of commands that cannot be edited by ANYONE

  if (['commandconf', 'eval', 'sys', 'power', 'registercmd', 'reload', 'set'].includes(cmd.help.name) && client.permlevel(message.member) > 5) return message.send('seriously? you\'re a trusted member of my team. why are you trying to disable a vital command? if it *really* needs to be disabled, get me to do it through the database or something.\n- Akii'); // Basically bot helper shaming, then redirecting to me.

  let cmdInDb;
  if (message.guild) {
    await commandsTable.findOne({ where: { command } }).then(data => {
      if (!data) return message.send(`❌ \`|\` ⚙️ \`${command}\` **has been disabled globally by the bot owner!**`);
      else cmdInDb = data.dataValues;
    });
  }

  if (client.permlevel(message.member) < client.levelCache[cmdInDb.permLevel]) return message.send(`❌ \`|\` ⚙️ \`${command}\`**'s permission level is higher than yours!**`);

  switch (option.toLowerCase()) {
    case 'enable': {
      if (cmdInDb.enabled) return message.send(`❌ \`|\` ⚙️ \`${command}\` **is already enabled!**`);
      commandsTable.update({ enabled: true }, { where: { command } })
        .then(() => message.send(`✅ \`|\` ⚙️ \`${command}\` **is now enabled!**`))
        .catch(e => {
          message.send(`❌ \`|\` ⚙️ \`${command}\` **could not be enabled!** Please try again later.`);
          client.logger.error(e);
        });
      break;
    }
    case 'disable': {
      if (!cmdInDb.enabled) return message.send(`❌ \`|\` ⚙️ \`${command}\` **is already disabled!**`);
      commandsTable.update({ enabled: false }, { where: { command } })
        .then(() => message.send(`✅ \`|\` ⚙️ \`${command}\` **is now disabled!**`))
        .catch(e => {
          message.send(`❌ \`|\` ⚙️ \`${command}\` **could not be disabled!** Please try again later.`);
          client.logger.error(e);
        });
      break;
    }
    case 'setperm': {
      permlevel = permlevel.join(' ');
      if(!permlevel || permlevel === '') return message.send('❌ `|` ⚙️ **You didn\'t give me a perm level to set the command to!**');
      if(![0, 1, 2, 3, 4, 5, 8, 9, 10].includes(client.levelCache[permlevel])) return message.send(`❌ \`|\` ⚙️ \`${permlevel}\` **is not recognized as a valid permission level!**`);
      if(client.levelCache[permlevel] > client.permlevel(message.member)) return message.send(`❌ \`|\` ⚙️ **You cannot set** \`${command}\` **to** \`${permlevel}\`**!** Doing so would remove your access.`);

      commandsTable.update({ permLevel: permlevel }, { where: { command } })
        .then(() => message.send(`✅ \`|\` ⚙️ \`${command}\`**'s permission level has been updated to** \`${permlevel}\`**.**`))
        .catch(e => {
          message.send(`❌ \`|\` ⚙️ \`${command}\`**'s permission level could not be changed.** Please try again later.`);
          client.logger.error(e);
        });
      break;
    }
    default: return message.send('❌ `|` ⚙️ **Invalid option!** `enable`, `disable`, or `setperm` are accepted.');
  }

};

exports.conf = {
  enabled: true,
  aliases: ['command', 'changecmd', 'changecommand', 'cmdconf'],
  guildOnly: true,
  permLevel: 'Administrator'
};

exports.help = {
  name: 'commandconf',
  description: 'Configure command settings',
  usage: 'command <enable | disable | setperm> <command name> [<perm level>]',
  category: 'Server'
};