const Discord = require('discord.js');
const parse = require('parse-duration');
const moment = require('moment');
require('moment-duration-format');

module.exports.run = async (client, message, args) => {
  const toBan = message.mentions.users.first();
  const toBanM = message.mentions.members.first();
  const reason = args.slice(2).join(' ');
  const duration = args[1];
  const bhEmote = '<:banhammer:459184964110385153>';

  if(!message.guild.me.permissions.has('BAN_MEMBERS')) return message.send(`:x: \`|\` ${bhEmote} **I am missing permissions:** \`Ban Members\``);
  if(!message.member.permissions.has('BAN_MEMBERS')) return message.send(`:x: \`|\` ${bhEmote} **You are missing permissions:** \`Ban Members\``);
  if(!toBan) return message.send(`:x: \`|\` ${bhEmote} **You didn't mention someone to ban!**`);
  if(!duration) return message.send(`:x: \`|\` ${bhEmote} **You didn't set a duration!**`);
  if(!toBanM.bannable) return message.send(`:x: \`|\` ${bhEmote} **This member could not be banned!**`);

  const durationMs = parse(duration);
  const durationHR = moment.duration(durationMs).format('M [months] W [weeks] D [days], H [hrs], m [mins], s [secs]'); // HR = "Human Readable"

  if(durationMs === 0) return message.send(`:x: \`|\` ${bhEmote} **${duration} is not a valid duration!**`);

  await message.guild.modbase.create({
    victim: toBan.id,
    moderator: message.author.id,
    type: 'tempban',
    duration: durationMs
  }).then(async info => {
    let dmMsg = `${bhEmote} **You were tempbanned from** \`${message.guild.name}\` ***for*** \`${durationHR}\` \`|\` :bust_in_silhouette: **Responsible Moderator:** ${message.author.toString()} (${message.author.tag})`;

    let modEmbed = new Discord.RichEmbed()
      .setThumbnail(toBan.avatarURL)
      .setColor(client.config.colors.red)
      .setFooter(`ID: ${toBan.id} | Case: ${info.id}`)
      .addField('Tempbanned User', `${toBan.toString()} (${toBan.tag})`)
      .addField('Moderator', `${message.author.toString()} (${message.author.tag})`)
      .addField('Duration', durationHR);

    if(reason) {dmMsg += `\n\n:gear: **Reason:** \`${reason}\``; modEmbed.addField('Reason', reason); message.guild.modbase.update({ reason: reason }, { where: {id: info.id }});}

    await toBan.send(dmMsg);
    await message.guild.ban(toBan, {days: 1});
    await message.guild.settings.get('modLogChannel')
      .then(async modLogChannel => {
        modLogChannel = message.guild.channels.find(g => g.name.toLowerCase() === modLogChannel.toLowerCase());
        if (modLogChannel === null) return message.send(`:warning: **Tempban issued, but there is no mod log channel set.** Try \`${await message.guild.settings.get('prefix')}set <edit/add> modLogChannel <channel name>\``);
        if (!message.guild.me.permissionsIn(modLogChannel).serialize()['SEND_MESSAGES'] || !message.guild.me.permissionsIn(modLogChannel).serialize()['EMBED_LINKS']) {
          modLogChannel.overwritePermissions(client.user, { SEND_MESSAGES: true, EMBED_LINKS: true }).catch(() => { return message.send(`:warning: **Tempban issued, but I errored:**\nI tried to give myself permissions to send messages or post embeds in ${modLogChannel}, but I couldn't. Please make sure I have the \`Manage Roles\` permission, as that allows me to.`); });
        }
        await modLogChannel.send(modEmbed);
        await message.send(`:white_check_mark: \`|\` ${bhEmote} **Tempbanned user \`${toBan.tag}\`**`);
      })
      .catch(async e => message.send(`:x: **There was an error finding the mod log channel:** \`${e.stack}\``));
    setTimeout(async () => {
      await message.guild.modbase.create({
        victim: toBan.id,
        moderator: client.user.id,
        type: 'tempban unban',
      }).then(async info => {
        modEmbed = new Discord.RichEmbed()
          .setThumbnail(toBan.avatarURL)
          .setColor(client.config.colors.green)
          .setAuthor(`Unbanned ${toBan.tag} (${toBan.id})`)
          .setFooter(`ID: ${toBan.id} | Case: ${info.id}`)
          .addField('User', `${toBan.toString()} (${toBan.tag})`)
          .addField('Moderator', client.user.toString());

        if(!reason) {message.guild.modbase.update({ reason: 'Tempban auto unban' }, { where: {id: info.id}}); await modEmbed.addField('Reason', 'Tempban unban');}
        else {message.guild.modbase.update({ reason: `${reason} | Tempban auto unban`}, { where: {id: info.id}}); await modEmbed.addField('Reason', `${reason} | Tempban auto unban`);}

        await message.guild.settings.get('modLogChannel')
          .then(async modLogChannel => {
            modLogChannel = message.guild.channels.find(g => g.name.toLowerCase() === modLogChannel.toLowerCase());
            if (modLogChannel === null) return message.send(`:warning: **A tempban has completed, but there is no mod log channel set.** Try \`${await message.guild.settings.get('prefix')}set <edit/add> modLogChannel <channel name>\``);
            if (!message.guild.me.permissionsIn(modLogChannel).serialize()['SEND_MESSAGES'] || !message.guild.me.permissionsIn(modLogChannel).serialize()['EMBED_LINKS']) {
              modLogChannel.overwritePermissions(client.user, { SEND_MESSAGES: true, EMBED_LINKS: true }).catch(() => { return message.send(`:warning: **A tempban has completed, but I errored:**\n I tried to give myself permissions to send messages or post embeds in ${modLogChannel}, but I couldn't. Please make sure I have the \`Manage Roles\` permission, as that allows me to.`); });
            }
            await modLogChannel.send(modEmbed);
          })
          .catch(async e => message.send(`:x: **There was an error finding the mod log channel:** \`${e.stack}\``));

        message.guild.unban(toBan);
      });
    }, durationMs);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['temporaryban'],
  permLevel: 'Moderator'
};

exports.help = {
  name: 'tempban',
  description: 'Temporarily ban someone from the server',
  usage: 'tempban <@user> <duration> [reason]\nDuration example: "1y2w8d4h5m10s" -> 1 year 2 weeks 8 days etc long',
  category: 'Moderation'
};