// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

const moment = require('moment');

module.exports = async (client, message) => {
  const a = new Date();
  if (message.author.bot && !client.config.ciMode) return;
  message.benchmarks = {};

  require('../dbFunctions/message/misc.js')(client, message);

  let commandsTable;
  if (message.channel.type !== 'dm') commandsTable = require('../dbFunctions/message/commands').functions.commandsSchema(message.guild.id);

  let settingsFunctions;
  let settingsSchema;
  if(message.channel.type !== 'dm') {
    settingsFunctions = require('../dbFunctions/message/settings').functions;
    settingsSchema = settingsFunctions.settingsSchema(message.guild.id);
  }

  let capsWarnEnabled = client.config.defaultSettings.capsWarnEnabled;
  if (!message.guild) capsWarnEnabled = client.config.defaultSettings.capsWarnEnabled;
  else {
    await settingsSchema.findOrCreate({ where: { key: 'capsWarnEnabled' }, defaults: { value: 'false' } });
    capsWarnEnabled = await settingsFunctions.get(message.guild.id, 'capsWarnEnabled');
  }
  message.benchmarks['CapsWarnEnabledBenchmark'] = new Date() - a;

  let capsThreshold = client.config.defaultSettings.capsThreshold;
  if (!message.guild) capsThreshold = client.config.defaultSettings.capsThreshold;
  else {
    await settingsSchema.findOrCreate({ where: { key: 'capsThreshold' }, defaults: { value: '70' } });
    capsThreshold = await settingsFunctions.get(message.guild.id, 'capsThreshold');
  }
  message.benchmarks['CapsThresholdBenchmark'] = new Date() - a;

  let staffBypassesLimits = client.config.defaultSettings.staffBypassesLimits;
  if (!message.guild) staffBypassesLimits = client.config.defaultSettings.staffBypassesLimits;
  else {
    await settingsSchema.findOrCreate({ where: { key: 'staffBypassesLimits' }, defaults: { value: 'true' } });
    staffBypassesLimits = await settingsFunctions.get(message.guild.id, 'staffBypassesLimits');
  }
  message.benchmarks['StaffBypassesLimitsBenchmark'] = new Date() - a;

  const exceedsCapsThreshold = message.content.match(/[A-Z]+/g) !== null &&
    message.content.length >= 15 &&
    capsWarnEnabled === 'true' &&
    (message.content.match(/[A-Z]+/g).join(' ').replaceAll(' ', '').split('').length / message.content.length) * 100 >= capsThreshold;
    /* ok so this mess of code checks to see if the message has more than ${capsThreshold}% caps. To break it down, it matches all of the capital letters in the message. Then joins the array that spits out. Then it replaces all of the spaces with an empty string, so they looklikethisinsteadofspaced, then it splits it from each character. It takes the length of this array and divides it by the length of the message itself. It then multiplies that number by 100 to give the percentage, then it checks that number against ${capsThreshold}. */
  message.benchmarks['ExceedsCapsThreshold'] = new Date() - a;

  const emsg = `⚠️ \`|\` ${message.author}**, your message is more than ${capsThreshold}% caps.** Please do not spam caps.`;
  if(exceedsCapsThreshold) {
    if (client.permlevel(message.member) !== 0) {
      if(staffBypassesLimits === 'true');
      else { message.delete(); message.send(emsg).then(msg => msg.delete(6000)); }
    } else { message.delete(); message.send(emsg).then(msg => msg.delete(6000)); }
  }

  if (message.channel.type !== 'dm') {
    const { functions } = require('../dbFunctions/message/xp.js');

    let xpLevelUpMessage = client.config.defaultSettings.xpLevelUpMessage;
    if (!message.guild) xpLevelUpMessage = client.config.defaultSettings.xpLevelUpMessage;
    else {
      await settingsSchema.findOrCreate({ where: { key: 'xpLevelUpMessage' }, defaults: { value: ':arrow_up: **{{user}} just advanced to level {{level}}!**' } });
      xpLevelUpMessage = await settingsFunctions.get(message.guild.id, 'xpLevelUpMessage');
    }
    message.benchmarks['XpLevelUpMessageBenchmark'] = new Date() - a;

    // Adds XP
    if (!client.xpLockSet.has(message.author.id)) {
      const randomXP = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(1) + 1)) + Math.ceil(1);
      functions.add(message.guild.id, message.author.id, randomXP); // Adds either 1 or 2 xp ...
      client.xpLockSet.add(message.author.id);
      setTimeout(() => client.xpLockSet.delete(message.author.id), 60000); // ... per minute.
    }

    // Checks if level up is possible
    functions.xpSchema(message.guild.id).findOne({ where: { user: message.author.id }})
      .then(user => {
        if (xpNeededToLevelUp(user.dataValues.level) < user.dataValues.xp) {
          message.channel.send(xpLevelUpMessage.replaceAll('{{user}}', message.author.toString()).replaceAll('{{level}}', user.dataValues.level +1)).then(msg => msg.delete(10000));
          user.increment('level');
        }

        function xpNeededToLevelUp(x) {
          return 5 * (10 ** -4) * ((x*100) ** 2) + (0.5 * (x*100)) + 100;
        }
      });
  }
  message.benchmarks['XpAdditionAndLevelCheckBenchmark'] = new Date() - a;

  // prefix creator
  const prefix = message.guild
    ? client.settings.get(message.guild.id)['prefix']
    : client.config.defaultSettings.prefix;
  message.benchmarks['PrefixGetterBenchmark'] = new Date() - a;

  if (message.content.indexOf(prefix) !== 0) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Get the user or member's permission level from the elevation
  const level = client.permlevel(message.member);
  message.benchmarks['LevelGetterBenchmark'] = new Date() - a;

  // Check whether the command, or alias, exist in the collections defined
  // in app.js.
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  message.benchmarks['CmdGetterBenchmark'] = new Date() - a;

  if (!cmd) return message.send(`❌ **That isn't one of my commands!** Try \`${prefix}help\``);

  let cmdInDb;
  if (message.guild) {
    await commandsTable.findOne({ where: { command: cmd.help.name } }).then(data => {
      if(!data) cmdInDb === null;
      else cmdInDb = data.dataValues;
    });
  } else cmdInDb = {
    enabled: cmd.conf.enabled,
    permLevel: cmd.conf.permLevel
  };
  message.benchmarks['CmdInDbGetterBenchmark'] = new Date() - a;

  // systemNotice creator
  const systemNotice = message.guild
    ? client.settings.get(message.guild.id)['systemNotice']
    : client.config.defaultSettings.systemNotice;
  message.benchmarks['SystemNoticeBenchmark'] = new Date() - a;

  // Command status check
  if ((!cmdInDb || !cmd.conf.enabled) && message.author.id !== client.config.ownerID) return message.send('❌ **That command is disabled globally by the developer!**');
  else {
    if(!cmdInDb.enabled) {
      if(systemNotice === 'true') message.send('❌ **This command is disabled for the server!**');
      return;
    }
  }

  // Some commands may not be useable in DMs. This check prevents those commands from running
  // and return a friendly error message.
  if (cmd && !message.guild && cmd.conf.guildOnly) return message.send('❌ **This command cannot be run in DM\'s.**');
  message.benchmarks['CmdDmsBenchmark'] = new Date() - a;

  if(client.levelCache[cmdInDb.permLevel] > level) {
    if (systemNotice === 'true') message.send('❌ **You do not have permission to use this command!**');
    return;
  }
  message.benchmarks['DbPermCheckBenchmark'] = new Date() - a;

  // Embed check
  if (cmd.conf.requiresEmbed && message.guild && !message.guild.me.permissionsIn(message.channel).serialize()['EMBED_LINKS'])
    return message.send('❌ **This command requires `Embed Links`, which I don\'t have!**');
  message.benchmarks['EmbedCheckBenchmark'] = new Date() - a;

  // Cooldown check
  if(cmd.conf.cooldown) {
    if(!message.author.cooldownSet) message.author.cooldownSet = new Set();
    if(!message.author.cooldownTimers) message.author.cooldownTimers = new Map();

    if(!message.author.cooldownSet.has(cmd.help.name)) {
      message.author.cooldownSet.add(cmd.help.name);
      message.author.cooldownTimers.set(cmd.help.name, new client.timer(() => message.author.cooldownSet.delete(cmd.help.name), cmd.conf.cooldown));
    } else {
      const timeLeftMs = message.author.cooldownTimers.get(cmd.help.name).getTimeLeft();
      let timeLeft = new Date();
      timeLeft.setMilliseconds(new Date().getMilliseconds() + timeLeftMs);
      timeLeft = moment(timeLeft).fromNow(); // Time / date / milliseconds shenanegins.

      return message.send(`:x: \`|\` :stopwatch: **Cooldown! Try again ${timeLeft}**`).then(msg => msg.delete(7000));
    }
  }

  /* -------------------- RUNS THE COMMAND -------------------- */
  client.logger.cmd(`${client.config.permLevels.find(l => l.level === level).name} ${message.author.tag} (${message.author.id}) ran ${cmd.help.name}${message.edited ? ' (edited) ' : ' '}${message.guild ? `in ${message.guild.name} (${message.guild.id})` : 'in DMs'}`);
  await cmd.run(client, message, args, level);
  /* -------------------- RUNS THE COMMAND -------------------- */

  message.benchmarks['CmdRunBenchmark'] = new Date() - a;
  message.benchmarks['TOTAL_BENCHMARK'] = new Date() - a;

  // Other server database checks
  if (message.guild) {
    for (const setting of Object.entries(client.config.defaultSettings)) {
      const key = setting[0];
      const value = setting[1];

      settingsSchema.findOrCreate({ where: { key: key }, defaults: { value: value }});
    }
    settingsSchema.sync();

    for (const command of client.commands.filter(g => g.conf.enabled)) {
      const folder = client.folder.get(command[0]);
      const enabled = command[1].conf.enabled;
      const permLevel = command[1].conf.permLevel;

      await commandsTable.findOrCreate({ where: { command: command[0], permLevel: permLevel }, defaults: { folder: folder, enabled: enabled } })
        .catch(async e => {
          if(e.name === 'SequelizeUniqueConstraintError') {
            await commandsTable.destroy({ where: { command: command[0] }});
            await commandsTable.create({ command: command[0], permLevel: permLevel, folder: folder, enabled: enabled });
            commandsTable.sync();
          }
          else client.logger.error(e);
        });
    }
    commandsTable.sync();
  }

  if(client.config.ciMode) client.emit('ciStepFinish', message.benchmarks);
};
