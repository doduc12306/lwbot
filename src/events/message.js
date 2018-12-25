// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = async (client, message) => {
  if (message.author.bot) return;
  require('../modules/msgfunctions.js')(client, message);

  // Thanks, MDN
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  if(message.channel.type !== 'dm') {
    if(!client.xpLockSet.has(message.author.id)) {
      message.guild.xp.add(message.author.id, getRandomIntInclusive(1, 2));
      client.xpLockSet.add(message.author.id);
      setTimeout(() => client.xpLockSet.delete(message.author.id), 60000);
    }
  }

  let prefix = client.config.defaultSettings.prefix;
  if (!message.guild) prefix = client.config.defaultSettings.prefix;
  else {
    await message.guild.settings.findOrCreate({where: {key: 'prefix'}, defaults: {value: '!w '}});
    prefix = await message.guild.settings.get('prefix');
  }

  if (message.content.indexOf(prefix) !== 0) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Get the user or member's permission level from the elevation
  const level = client.permlevel(message);

  // Check whether the command, or alias, exist in the collections defined
  // in app.js.
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

  let systemNotice = client.config.defaultSettings.systemNotice;
  if (!message.guild) systemNotice = client.config.defaultSettings.systemNotice;
  else {
    await message.guild.settings.findOrCreate({ where: { key: 'systemNotice' }, defaults: { value: 'true' } });
    systemNotice = await message.guild.settings.get('systemNotice');
  }
  // using this const varName = thing OR otherthing; is a pretty efficient
  // and clean way to grab one of 2 values!
  if (!cmd) return message.channel.send(`:x: That isn't one of my commands! Try ${prefix}help`);

  if (!cmd.conf.enabled) if (systemNotice === 'true') return message.channel.send(`:x: \`${cmd.help.name}\` **is currently disabled.**`);

  // Some commands may not be useable in DMs. This check prevents those commands from running
  // and return a friendly error message.
  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send(':x: **This command cannot be run in DM\'s.**');

  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (systemNotice === 'true') {
      return message.channel.send(`:x: You do not have permission to use this command.\nYour permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})\nThis command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
    } else {
      return;
    }
  }

  if (cmd.conf.requiresEmbed && message.guild && !message.guild.me.permissionsIn(message.channel).serialize()['EMBED_LINKS'])
    return message.channel.send(':x: **This command requires `Embed Links`, which I don\'t have!**');

  client.tags.sync();

  // If the command exists, **AND** the user has permission, run it.
  client.logger.cmd(`${client.config.permLevels.find(l => l.level === level).name} ${message.author.tag} (${message.author.id}) ran ${cmd.help.name} in ${message.guild.name} (${message.guild.id})`);
  await cmd.run(client, message, args, level);

  // Other server database checks
  if (message.guild) {
    await message.guild.settings.findOrCreate({ where: { key: 'modLogChannel' }, defaults: { value: 'mod_logs' } });
    await message.guild.settings.findOrCreate({ where: { key: 'modRole' }, defaults: { value: 'Mods' } });
    await message.guild.settings.findOrCreate({ where: { key: 'adminRole' }, defaults: { value: 'Admins' } });
    await message.guild.settings.findOrCreate({ where: { key: 'welcomeEnabled' }, defaults: { value: 'true' } });
    await message.guild.settings.findOrCreate({ where: { key: 'welcomeChannel' }, defaults: { value: 'welcome' } });
    await message.guild.settings.findOrCreate({ where: { key: 'welcomeMessage' }, defaults: { value: 'Welcome to the server, {{user}}!' } });
    await message.guild.settings.findOrCreate({ where: { key: 'announcementChannel' }, defaults: { value: 'announcements' } });
    await message.guild.settings.findOrCreate({ where: { key: 'botCommanderRole' }, defaults: { value: 'Bot Commander' } });
    await message.guild.settings.findOrCreate({ where: { key: 'ownerRole' }, defaults: { value: 'Owners' } });
  }
};
