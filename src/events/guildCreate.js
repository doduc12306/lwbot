module.exports = async (client, guild) => {
  // Thanks for this PSA, York. This guild is full of userbots spamming commands. If this bot enters it, you'll see extreme performance issues.
  if (guild.id === '439438441764356097') return guild.leave();

  client.logger.log(`Joined guild ${guild.name} (${guild.id})`);

  require('../util/sqWatchdog').runner(client, guild.id); // Runs sync-up for the guild. Settings, commands, xp

  if (!guild.me.permissions.has('SEND_MESSAGES')) guild.owner.send('❌ **CRITICAL PERMISSION MISSING:** `Send Messages` **WHICH EVERYTHING REQUIRES!**');
  if (!guild.me.permissions.has('EMBED_LINKS')) guild.owner.send('❌ **CRITICAL PERMISSION MISSING:** `Embed Links` **WHICH EVERYTHING REQUIRES!**');

  let textErrored = false;
  let voiceErrored = false;
  let mutedRoleCreateError = false;

  let role = await guild.roles.find(g => g.name.toLowerCase() === 'muted');
  if (!role) {
    role = await guild.createRole({ name: 'Muted', color: 'DARK_ORANGE', position: guild.me.highestRole.position - 1 }, 'Guild Create | Guild setup!')
      .then(role => { client.logger.verbose(`guildCreate | Created muted role in ${guild.name} (${guild.id})`); owPerms(role); })
      .catch(e => { mutedRoleCreateError = true; client.logger.verbose(e); });
  }
  else { owPerms(role); }

  async function owPerms(role) {
    await guild.channels.filter(g => g.type === 'text').forEach(channel => {
      if (guild.me.permissionsIn(channel).serialize()['MANAGE_ROLES']) {
        channel.overwritePermissions(role, { SEND_MESSAGES: false, ADD_REACTIONS: false }, 'Initial Setup Process')
          .then(() => client.logger.verbose(`guildCreate | Wrote permissions for text channel #${channel.name} (${channel.id}) in ${guild.name} (${guild.id})`))
          .catch(e => { client.logger.verbose(e); textErrored = true; });
      }
      else client.logger.verbose(`guildCreate | Tried to write permissions to text channel #${channel.name} (${channel.id}) in ${guild.name} (${guild.id}), but I'm missing the MANAGE_ROLES permission.`);
    });
    await guild.channels.filter(g => g.type === 'voice').forEach(channel => {
      if (guild.me.permissionsIn(channel).serialize()['MANAGE_ROLES']) {
        channel.overwritePermissions(role, { CONNECT: false, SPEAK: false }, 'Inital Setup Process')
          .then(() => client.logger.verbose(`guildCreate | Wrote permissions for voice channel ${channel.name} (${channel.id}) in ${guild.name} (${guild.id})`))
          .catch(e => { client.logger.verbose(e); voiceErrored = true; });
      }
      else client.logger.verbose(`guildCreate | Tried to write permissions to voice channel ${channel.name} (${channel.id}) in ${guild.name} (${guild.id}), but I'm missing the MANAGE_ROLES permission.`);
    });
  }

  if (mutedRoleCreateError) {
    let msg = '❌ **Something went wrong during my setup process.**\n`-` I was unable to create a Muted role.';
    if (textErrored) msg += '\n`-` I was unable to disallow the Muted role from talking in text channels.';
    if (voiceErrored) msg += '\n`-` I was unable to disallow the Muted role from talking in voice channels.';
    msg += '\n\n**Please re-invite me.** When you invite me, please make sure I have all the permissions indicated on the invite page.';
    guild.owner.send(msg);
  }

  if (client.config.ciMode) client.emit('ciStepChannelCreate');
};
