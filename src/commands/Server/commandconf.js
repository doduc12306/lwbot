module.exports.run = async (client, message, [option, command, ...permlevel]) => {
  require('../../modules/message/commands.js')(client, message);

  if(!option || !['enable', 'disable', 'setperm'].includes(option)) return message.send(':x: `|` :gear: **Invalid option!** Accepted values: `enable`, `disable`, or `setperm`');

  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if(!cmd) return message.send(`:x: \`|\` :gear: \`${command}\` **does not exist, nor is it an alias!**`);
  if(!cmd.conf.enabled) return message.send(`:x: \`|\` :gear: \`${command}\` **has been disabled globally by the developer!**`);

  if (client.levelCache[cmd.conf.permLevel] > 5 && client.permlevel(message.member) < 6) return message.send(`:x: \`|\` :gear: \`${command}\` **can only be edited by** \`Bot Admin\` **or higher!** (Permission set by the developer)`); // 5 = Server Owner | 6 = Server Owner+ (Bot Admin / Support / Owner)

  if(['commandconf'].includes(cmd.help.name)) return message.send(`:x: \`|\` :gear: \`${command}\` **cannot be disabled!**`); // A list of commands that cannot be edited by ANYONE

  if(['commandconf', 'eval', 'sys', 'power', 'registercmd', 'reload', 'set'].includes(cmd.help.name) && client.permlevel(message.member) > 5) return message.send('oh come *on* dude, you\'re a trusted member of my team. you trying to disable a vital command does *not* help. if it *really* needs to be disabled, get me to do it through the database or something.\n- Akii'); // Basically bot helper shaming, then redirecting to me.

  let cmdInDb;
  if (message.guild) {
    await message.guild.commands.findOne({ where: { command: command } }).then(data => {
      if (!data) return message.send(`:x: \`|\` :gear: \`${command}\` **has been disabled globally by the developer!**`);
      else {
        if (data.dataValues.enabled === '0') data.dataValues.enabled = false;
        else data.dataValues.enabled = true;
        cmdInDb = data.dataValues;
      }
    });
  }

  switch(option.toLowerCase()) {
    case 'enable': {
      if(cmdInDb.enabled) return message.send(`:x: \`|\` :gear: \`${command}\` **is already enabled!**`);
      message.guild.commands.update({ enabled: true }, { where: { command: command } })
        .then(() => message.send(`:white_check_mark: \`|\` :gear: \`${command}\` **is now enabled!**`))
        .catch(e => {
          message.send(`:x: \`|\` :gear: \`${command}\` **could not be enabled!** Please try again later.`);
          client.logger.error(e);
        });
      break;
    }
    case 'disable': {
      if(!cmdInDb.enabled) return message.send(`:x: \`|\` :gear: \`${command}\` **is already disabled!**`);
      message.guild.commands.update({ enabled: false }, { where: { command: command } })
        .then(() => message.send(`:white_check_mark: \`|\` :gear: \`${command}\` **is now disabled!**`))
        .catch(e => {
          message.send(`:x: \`|\` :gear: \`${command}\` **could not be disabled!** Please try again later.`);
          client.logger.error(e);
        });
      break;
    }
    case 'setperm': {
      if(!permlevel || !['User', 'Moderator', 'Administrator', 'Bot Commander', 'Server Owner'].includes(permlevel)) return message.send(':x: `|` :gear: **Invalid permission level!** Accepted values: `User`, `Moderator`, `Administrator`, `Bot Commander`, or `Server Owner`'); // Type validation

      message.guild.commands.update({ permLevel: permlevel }, { where: { command: command } })
        .then(() => message.send(`:white_check_mark: \`|\` :gear: \`${command}\`**'s permission level has been updated to ${permlevel}.**`))
        .catch(e => {
          message.send(`:x: \`|\` :gear: \`${command}\`**'s permission level could not be changed.** Please try again later.`);
          client.logger.error(e);
        });
      break;
    }
    default: return message.send(':x: `|` :gear: **Invalid option!** `enable`, `disable`, or `setperm` are accepted.');
  }

};

exports.conf = {
  enabled: true,
  aliases: ['command', 'changecmd', 'changecommand', 'cmdconf'],
  guildOnly: true,
  permLevel: 'Bot Commander'
};

exports.help = {
  name: 'commandconf',
  description: 'Configure command settings',
  usage: 'command <enable | disable | setperm> <command name> [<perm level>]',
  category: 'Server'
};