const Sequelize = require('sequelize');

module.exports = async (client, guild) => {
  // Thanks for this PSA, York. This guild is full of userbots spamming commands. If this bot enters it, you'll see extreme performance issues.
  if(guild.id === '439438441764356097') return guild.leave();
  client.logger.log(`Joined guild ${guild.name} (${guild.id})`);

  const guildTable = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: `databases/servers/${guild.id}.sqlite`,
    logging: false
  });

  // Guild settings intialization
  guild.settings = await guildTable.define('settings', {
    key: {
      type: Sequelize.STRING,
      allowNull: false
    },
    value: Sequelize.STRING
  }, {timestamps: false});
  await guildTable.sync();

  const settings = {};
  for(const setting of Object.entries(client.config.defaultSettings)) {
    await guild.settings.findOrCreate({ where: { key: setting[0] }, defaults: { value: setting[1] } });
    settings[setting[0]] = setting[1];
  }
  guildTable.sync();
  client.settings.set(guild.id, settings);

  if (!guild.me.permissions.has('SEND_MESSAGES')) guild.owner.send(':x: **CRITICAL PERMISSION MISSING:** `Send Messages` **WHICH EVERYTHING REQUIRES!**');
  if (!guild.me.permissions.has('EMBED_LINKS')) guild.owner.send(':x: **CRITICAL PERMISSION MISSING:** `Embed Links` **WHICH EVERYTHING REQUIRES!**');

  let textErrored = false;
  let voiceErrored = false;
  let mutedRoleCreateError = false;

  let role = await guild.roles.find(g => g.name.toLowerCase() === 'muted');
  if(!role) {role = await guild.createRole({name: 'Muted', color: 'DARK_ORANGE', position: guild.me.highestRole.position - 1}, 'Guild Create | Guild setup!')
    .then(role => {client.verbose(`guildCreate | Created muted role in ${guild.name} (${guild.id})`); owPerms(role);})
    .catch(e => {mutedRoleCreateError = true; client.verbose(e);});}
  else {owPerms(role);}

  async function owPerms(role) {
    await guild.channels.filter(g => g.type === 'text').forEach(channel => {
      if (guild.me.permissionsIn(channel).serialize()['MANAGE_ROLES']) {channel.overwritePermissions(role, { SEND_MESSAGES: false, ADD_REACTIONS: false }, 'Initial Setup Process')
        .then(() => client.verbose(`guildCreate | Wrote permissions for text channel #${channel.name} (${channel.id}) in ${guild.name} (${guild.id})`))
        .catch(e => { client.verbose(e); textErrored = true; });}
      else client.logger.verbose(`guildCreate | Tried to write permissions to text channel #${channel.name} (${channel.id}) in ${guild.name} (${guild.id}), but I'm missing the MANAGE_ROLES permission.`);
    });
    await guild.channels.filter(g => g.type === 'voice').forEach(channel => {
      if (guild.me.permissionsIn(channel).serialize()['MANAGE_ROLES']) {
        channel.overwritePermissions(role, { CONNECT: false, SPEAK: false }, 'Inital Setup Process')
          .then(() => client.verbose(`guildCreate | Wrote permissions for voice channel ${channel.name} (${channel.id}) in ${guild.name} (${guild.id})`))
          .catch(e => { client.verbose(e); voiceErrored = true; });}
      else client.logger.verbose(`guildCreate | Tried to write permissions to voice channel ${channel.name} (${channel.id}) in ${guild.name} (${guild.id}), but I'm missing the MANAGE_ROLES permission.`);
    });
  }

  if(mutedRoleCreateError) {
    let msg = ':x: **Something went wrong during my setup process.**\n`-` I was unable to create a Muted role.';
    if(textErrored) msg += '\n`-` I was unable to disallow the Muted role from talking in text channels.';
    if(voiceErrored) msg += '\n`-` I was unable to disallow the Muted role from talking in voice channels.';
    msg += '\n\n**Please re-invite me.** When you invite me, please make sure I have all the permissions indicated on the invite page.';
    guild.owner.send(msg);
  }

  guild.commands = await guildTable.define('commands', {
    command: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    folder: {
      type: Sequelize.STRING,
      allowNull: false
    },
    enabled: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    permLevel: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, { timestamps: false });
  await guildTable.sync();

  for (const command of client.commands.filter(g => g.conf.enabled)) {
    const folder = client.folder.get(command[0]);
    const enabled = command[1].conf.enabled;
    const permLevel = command[1].conf.permLevel;

    await guild.commands.findOrCreate({ where: { command: command[0] }, defaults: { folder: folder, enabled: enabled, permLevel: permLevel } });
  }
};
