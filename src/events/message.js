const moment = require('moment');
const { Message } = require('discord.js');

module.exports = async (client, message) => {
  const a = new Date();
  if ((message.author.bot && !client.config.ciMode) || client.ws.status !== 0) return;
  message.benchmarks = {};

  require('../dbFunctions/message/misc.js')(client, message);
  require('../dbFunctions/message/modbase.js')(client, message);

  let commandsTable;
  if (message.channel.type !== 'dm') commandsTable = require('../dbFunctions/message/commands').functions.commandsSchema(message.guild.id); 

  const capsWarnEnabled = message.guild
    ? client.settings.get(message.guild.id)['capsWarnEnabled'] === 'true' ? true : false
    : client.config.defaultSettings['capsWarnEnabled'];
  message.benchmarks['CapsWarnEnabledBenchmark'] = new Date() - a;

  const capsThreshold = message.guild
    ? client.settings.get(message.guild.id)['capsThreshold']
    : client.config.defaultSettings['capsThreshold'];
  message.benchmarks['CapsThresholdBenchmark'] = new Date() - a;

  const capsDelete = message.guild
    ? client.settings.get(message.guild.id)['capsDelete']
    : client.config.defaultSettings['capsDelete'];
  message.benchmarks['CapsDeleteBenchmark'] = new Date() - a;

  const staffBypassesLimits = message.guild
    ? client.settings.get(message.guild.id)['staffBypassesLimits'] === 'true' ? true : false
    : client.config.defaultSettings['staffBypassesLimits'];
  message.benchmarks['StaffBypassesLimitsBenchmark'] = new Date() - a;

  const exceedsCapsThreshold = message.content.match(/[A-Z]+/g) !== null && // Make sure the message HAS caps
    message.content.length >= 15 && // Message length is more than 15 characters
    capsWarnEnabled && // The warning is enabled?
    (message.content.match(/[A-Z]+/g).join(' ').replaceAll(' ', '').length / message.content.length) * 100 >= capsThreshold; // Percentage of caps is above the threshold
  message.benchmarks['ExceedsCapsThreshold'] = new Date() - a;

  const emsg = `⚠️ \`|\` ${message.author}**, your message is more than ${capsThreshold}% caps.** Please do not spam caps.`;
  if (exceedsCapsThreshold) {
    if (client.permlevel(message.member) !== 0) {
      if (staffBypassesLimits);
      else { capsDelete ? message.delete() : false; message.send(emsg).then(msg => msg.delete({ timeout: 6000 })); }
    } else { capsDelete ? message.delete() : false; message.send(emsg).then(msg => msg.delete({ timeout: 6000 })); }
  }

  if (message.channel.type !== 'dm') {
    const { functions } = require('../dbFunctions/message/xp.js');

    const xpLevelUpEnabled = message.guild
      ? client.settings.get(message.guild.id)['xpLevelUpEnabled'] === 'true' ? true : false
      : client.config.defaultSettings['xpLevelUpEnabled'];
    message.benchmarks['XpLevelUpEnabledBenchmark'] = new Date() - a;

    const xpLevelUpMessage = message.guild
      ? client.settings.get(message.guild.id)['xpLevelUpMessage']
      : client.config.defaultSettings['xpLevelUpMessage'];
    message.benchmarks['XpLevelUpMessageBenchmark'] = new Date() - a;

    // Adds XP
    if (!client.xpLockSet.has(message.author.id)) {
      const randomXP = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(1) + 1)) + Math.ceil(1);
      functions.add(message.guild.id, message.author.id, randomXP); // Adds either 1 or 2 xp ...
      client.xpLockSet.add(message.author.id);
      setTimeout(() => client.xpLockSet.delete(message.author.id), 60000); // ... per minute.
    }

    // Checks if level up is possible
    functions.xpSchema(message.guild.id).findOrCreate({ where: { user: message.author.id }, defaults: { xp: 0, level: 0 } })
      .then(user => {
        user = user[0];
        if (xpNeededToLevelUp(user.dataValues.level) < user.dataValues.xp) {
          if (xpLevelUpEnabled) message.send(xpLevelUpMessage.replaceAll('{{user}}', message.author.toString()).replaceAll('{{level}}', user.dataValues.level + 1)).then(msg => msg.delete({timeout: 10000}));
          user.increment('level');
        }
      });

  }
  message.benchmarks['XpAdditionAndLevelCheckBenchmark'] = new Date() - a;

  // prefix creator
  const prefix = message.guild
    ? client.settings.get(message.guild.id)['prefix']
    : client.config.defaultSettings.prefix;
  message.benchmarks['PrefixGetterBenchmark'] = new Date() - a;

  const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);

  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (!command) {
    const responses = ['...yes? That\'s me, did you need something?', 'What would you like, young one?', 'Yes?', 'You rang?', 'What\'s up?', 'You\'re missing a little something there..', 'Oops. Missed a spot.', 'Hello?', 'Hi there! Need something?', 'Hmm?', 'Wot', 'Huh? You say something? Didn\'t quite catch that.', '😬'];
    return message.send(responses.randomElement());
  }

  // Get the user or member's permission level from the elevation
  const level = message.guild ? client.permlevel(message.member) : 0;
  message.benchmarks['LevelGetterBenchmark'] = new Date() - a;

  // Check whether the command, or alias, exist in the collections defined
  // in app.js.
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  message.benchmarks['CmdGetterBenchmark'] = new Date() - a;

  if (!cmd) return message.send(`❌ **That isn't one of my commands!** Try \`${prefix}help\``);

  let cmdInDb;
  if (message.guild) {
    await commandsTable.findOne({ where: { command: cmd.help.name } }).then(data => {
      if (!data) cmdInDb === null;
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
    : client.config.defaultSettings['systemNotice'];
  message.benchmarks['SystemNoticeBenchmark'] = new Date() - a;

  // Command status check
  if (!cmd.conf.enabled || !cmdInDb) return message.send(':x: **This command is disabled globally!**');
  if (!cmdInDb.enabled && client.permlevel(message.member) < 8) return message.send(':x: **This command is disabled for this server!**');

  // Some commands may not be useable in DMs. This check prevents those commands from running
  // and return a friendly error message.
  if (cmd && !message.guild && cmd.conf.guildOnly) return message.send('❌ **This command cannot be run in DM\'s.**');
  message.benchmarks['CmdDmsBenchmark'] = new Date() - a;

  if (client.levelCache[cmdInDb.permLevel] > level) {
    if (systemNotice === 'true') message.send('❌ **You do not have permission to use this command!**');
    return;
  }
  message.benchmarks['DbPermCheckBenchmark'] = new Date() - a;

  // Embed check
  if (cmd.conf.requiresEmbed && message.guild && !message.guild.me.permissionsIn(message.channel).has('EMBED_LINKS'))
    return message.send('❌ **This command requires `Embed Links`, which I don\'t have!**');
  message.benchmarks['EmbedCheckBenchmark'] = new Date() - a;

  // if embed and no accent color, set it and send it.
  client.accentColor = message.guild
    ? client.settings.get(message.guild.id)['accentColor']
    : client.config.defaultSettings['accentColor'];

  // Cooldown check
  if (cmd.conf.cooldown) {
    if (!message.author.cooldownSet) message.author.cooldownSet = new Set();
    if (!message.author.cooldownTimers) message.author.cooldownTimers = new Map();

    if (message.author.cooldownSet.has(cmd.help.name)) {
      const timeLeftMs = message.author.cooldownTimers.get(cmd.help.name).getTimeLeft();
      let timeLeft = new Date();
      timeLeft.setMilliseconds(new Date().getMilliseconds() + timeLeftMs);
      timeLeft = moment(timeLeft).fromNow(); // Time / date / milliseconds shenanegins.

      const cooldownMessages = ['Cooldown!', 'You\'re going too fast!', 'Please slow down!', 'Hold your horses!', 'Stop going that fast!', 'I need some time to rest.', 'You\'re making me tired.. :yawning:', 'Why must you go that fast?', 'I\'m gonna hit you if you keep going.', 'Error 429: Ratelimited `|`'];
      return message.send(`❌ \`|\` ⏱ **${cooldownMessages.randomElement()} Try again ${timeLeft}.**`).then(msg => msg.delete({ timeout: 10000 }));
    }
  }

  /* -------------------- RUNS THE COMMAND -------------------- */
  client.logger.cmd(`${client.config.permLevels.find(l => l.level === level).name} ${message.author.tag} (${message.author.id}) ran ${cmd.help.name}${message.edited ? ' (edited) ' : ' '}${message.guild ? `in ${message.guild.name} (${message.guild.id})` : 'in DMs'}`);
  try {
    const response = await cmd.run(client, message, args, level);
    
    // If the command returned successful, create a cooldown on it
    if(!response || (response instanceof Message && /(:white_check_mark:)|(✅)/gi.test(response.content))) {
      // Cooldown check
      if (cmd.conf.cooldown) {
        if (!message.author.cooldownSet) message.author.cooldownSet = new Set();
        if (!message.author.cooldownTimers) message.author.cooldownTimers = new Map();

        if (!message.author.cooldownSet.has(cmd.help.name)) {
          message.author.cooldownSet.add(cmd.help.name);
          message.author.cooldownTimers.set(cmd.help.name, new client.timer(() => message.author.cooldownSet.delete(cmd.help.name), cmd.conf.cooldown));
        }
      }
    }

  } catch (e) {
    if(e.message.includes('no such table')) {
      return message.send(':warning: `|` :gear: **Oops!** Some data hasn\'t yet been initialized for this user. **Please run this command again!**');
    }
    
    client.logger.verbose(`From: ${__filename}`);
    client.logger.error(e);
    let firstErrorStackTrace;
    if (e.stack) firstErrorStackTrace = e.stack.split('\n')[1];
    message.send(`:x: **Something went wrong running the command:**\n\`\`\`\n${e}\n\t${firstErrorStackTrace}\n\`\`\` `);
  }
  /* -------------------- RUNS THE COMMAND -------------------- */

  message.benchmarks['CmdRunBenchmark'] = new Date() - a;
  message.benchmarks['TOTAL_BENCHMARK'] = new Date() - a;

  if (client.config.ciMode) client.emit('ciStepFinish', message.benchmarks);
};

function xpNeededToLevelUp(x) {
  return 5 * (10 ** -4) * ((x * 100) ** 2) + (0.5 * (x * 100)) + 100;
}
