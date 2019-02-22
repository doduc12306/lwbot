// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = async (client, message) => {
  const a = new Date();
  if (message.author.bot) return;
  message.benchmarks = {};

  if (message.channel.type !== 'dm') require('../modules/message/settings.js')(client, message);
  require('../modules/message/xp.js')(client, message);
  require('../modules/message/misc.js')(client, message);
  require('../modules/message/commands.js')(client, message);
  message.benchmarks['RequireBenchmark'] = new Date() - a;

  let capsWarnEnabled = client.config.defaultSettings.capsWarnEnabled;
  if (!message.guild) capsWarnEnabled = client.config.defaultSettings.capsWarnEnabled;
  else {
    await message.guild.settings.findOrCreate({ where: { key: 'capsWarnEnabled' }, defaults: { value: 'false' } });
    capsWarnEnabled = await message.guild.settings.get('capsWarnEnabled');
  }
  message.benchmarks['CapsWarnEnabledBenchmark'] = new Date() - a;

  let capsThreshold = client.config.defaultSettings.capsThreshold;
  if (!message.guild) capsThreshold = client.config.defaultSettings.capsThreshold;
  else {
    await message.guild.settings.findOrCreate({ where: { key: 'capsThreshold' }, defaults: { value: '70' } });
    capsThreshold = await message.guild.settings.get('capsThreshold');
  }
  message.benchmarks['CapsThresholdBenchmark'] = new Date() - a;

  let staffBypassesLimits = client.config.defaultSettings.staffBypassesLimits;
  if (!message.guild) staffBypassesLimits = client.config.defaultSettings.staffBypassesLimits;
  else {
    await message.guild.settings.findOrCreate({ where: { key: 'staffBypassesLimits' }, defaults: { value: 'true' } });
    staffBypassesLimits = await message.guild.settings.get('staffBypassesLimits');
  }
  message.benchmarks['StaffBypassesLimitsBenchmark'] = new Date() - a;

  const exceedsCapsThreshold = message.content.match(/[A-Z]+/g) !== null &&
    message.content.length >= 15 &&
    capsWarnEnabled === 'true' &&
    (message.content.match(/[A-Z]+/g).join(' ').replaceAll(' ', '').split('').length / message.content.length) * 100 >= capsThreshold; // ok so this mess of code checks to see if the message has more than ${capsThreshold}% caps. To break it down, it matches all of the capital letters in the message. Then joins the array that spits out. Then it replaces all of the spaces with an empty string, so they looklikethisinsteadofspaced, then it splits it from each character. It takes the length of this array and divides it by the length of the message itself. It then multiplies that number by 100 to give the percentage, then it checks that number against ${capsThreshold}.
  message.benchmarks['ExceedsCapsThreshold'] = new Date() - a;

  const emsg = `:warning: \`|\` ${message.author}**, your message is more than ${capsThreshold}% caps.** Please do not spam caps.`;
  if(exceedsCapsThreshold) {
    if (client.permlevel(message.member) !== 0) {
      if(staffBypassesLimits === 'true');
      else { message.delete(); message.send(emsg).then(msg => msg.delete(6000)); }
    } else { message.delete(); message.send(emsg).then(msg => msg.delete(6000)); }
  }

  if (message.channel.type !== 'dm') {
    if (!client.xpLockSet.has(message.author.id)) {
      message.guild.xp.add(message.author.id, Math.floor(Math.random() * (Math.floor(2) - Math.ceil(1) + 1)) + Math.ceil(1)); // Adds either 1 or 2 xp ...
      client.xpLockSet.add(message.author.id);
      setTimeout(() => client.xpLockSet.delete(message.author.id), 60000); // ... per minute.
    }
  }
  message.benchmarks['XpAdditionBenchmark'] = new Date() - a;

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

  let cmdInDb;
  if (message.guild) {
    await message.guild.commands.findOne({ where: { command: cmd.conf.name } }).then(data => {
      if(!data) cmdInDb === null;
      else {
        data.dataValues.enabled = data.dataValues.enabled === '1' ? true : false;
        cmdInDb = data.dataValues;
      }
    });
  }
  message.benchmarks['CmdInDbGetterBenchmark'] = new Date() - a;

  const systemNotice = message.guild
    ? client.settings.get(message.guild.id)['systemNotice']
    : client.config.defaultSettings.systemNotice;
  message.benchmarks['SystemNoticeBenchmark'] = new Date() - a;

  // using this const varName = thing OR otherthing; is a pretty efficient
  // and clean way to grab one of 2 values!
  if (!cmd) return message.send(`:x: **That isn't one of my commands!** Try \`${prefix}help\``);

  if ((!cmdInDb || !cmd.conf.enabled) && message.author.id !== client.config.ownerID) return message.send(':x: **That command is disabled globally by the developer!**');
  else {
    if(!cmdInDb.enabled) {
      if(systemNotice === 'true') message.send(':x: **This command is disabled for the server!**');
      return;
    }
  }

  // Some commands may not be useable in DMs. This check prevents those commands from running
  // and return a friendly error message.
  if (cmd && !message.guild && cmd.conf.guildOnly) return message.send(':x: **This command cannot be run in DM\'s.**');
  message.benchmarks['CmdDmsBenchmark'] = new Date() - a;

  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (systemNotice === 'true') {
      return message.send(`:x: You do not have permission to use this command.\nYour permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})\nThis command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
    } else return;
  }
  message.benchmarks['PermCheckBenchmark'] = new Date() - a;

  if (cmd.conf.requiresEmbed && message.guild && !message.guild.me.permissionsIn(message.channel).serialize()['EMBED_LINKS'])
    return message.send(':x: **This command requires `Embed Links`, which I don\'t have!**');
  message.benchmarks['EmbedCheckBenchmark'] = new Date() - a;

  // If the command exists, **AND** the user has permission, run it.
  client.logger.cmd(`${client.config.permLevels.find(l => l.level === level).name} ${message.author.tag} (${message.author.id}) ran ${cmd.help.name} in ${message.guild.name} (${message.guild.id})`);
  await cmd.run(client, message, args, level);
  message.benchmarks['CmdRunBenchmark'] = new Date() - a;
  message.benchmarks['TOTAL_BENCHMARK'] = new Date() - a;

  // Other server database checks
  if (message.guild) {
    message.guild.settings.findOrCreate({ where: { key: 'modLogChannel' }, defaults: { value: 'mod_logs' } });
    message.guild.settings.findOrCreate({ where: { key: 'modRole' }, defaults: { value: 'Mods' } });
    message.guild.settings.findOrCreate({ where: { key: 'adminRole' }, defaults: { value: 'Admins' } });
    message.guild.settings.findOrCreate({ where: { key: 'botCommanderRole' }, defaults: { value: 'Bot Commander' } });
    message.guild.settings.findOrCreate({ where: { key: 'ownerRole' }, defaults: { value: 'Owners' } });

    message.guild.settings.findOrCreate({ where: { key: 'welcomeEnabled' }, defaults: { value: 'true' } });
    message.guild.settings.findOrCreate({ where: { key: 'welcomeChannel' }, defaults: { value: 'welcome' } });
    message.guild.settings.findOrCreate({ where: { key: 'welcomeMessage' }, defaults: { value: 'Welcome to the server, {{user}}!' } });

    message.guild.settings.findOrCreate({ where: { key: 'announcementChannel' }, defaults: { value: 'announcements' } });

    message.guild.settings.findOrCreate({ where: { key: 'capsWarnEnabled' }, defaults: { value: 'false' } });
    message.guild.settings.findOrCreate({ where: { key: 'capsThreshold' }, defaults: { value: '70' } });

    message.guild.settings.findOrCreate({ where: { key: 'staffBypassesLimits' }, defaults: { value: 'true' } });

    message.guild.settings.sync();

    for (const command of client.commands.filter(g => g.conf.enabled)) {
      const folder = client.folder.get(command[0]);
      const enabled = command[1].conf.enabled;
      const permLevel = command[1].conf.permLevel;

      await message.guild.commands.findOrCreate({ where: { command: command[0] }, defaults: { folder: folder, enabled: enabled, permLevel: permLevel } });
    }
    message.guild.commands.sync();
  }
};
