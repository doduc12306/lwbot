const Discord = require('discord.js');
const moment = require('moment');
const UserProfile = require('../../dbFunctions/client/user');

module.exports.run = async (client, message, args) => {
  let user;
  if(args[0]) {
    try { message.functions.parseUser(args[0]); } catch(e) { return message.send(':x: `|` 👤 **Couldn\'t find that user!**'); }
    user = message.functions.parseUser(args[0]);
  } else user = message.author;
  const member = message.guild.members.cache.get(user.id);
  const profile = new UserProfile(user);

  const embed = new Discord.MessageEmbed()
    .setAuthor(user.tag, user.displayAvatarURL({ format: 'png', dynamic: true }))
    .addField('ID', user.id, true)
    .setThumbnail(user.displayAvatarURL({ format: 'png', dynamic: true }))
    .setDescription(`${user.toString()} | ${await profile.mood}`)
    .addField('Status', user.presence.status === 'online' ? '<:online:450674128777904149> Online' : user.presence.status === 'dnd' ? '<:dnd:450674354163023882> Do Not Disturb' : user.presence.status === 'idle' ? '<:idle:450674222176403456> Idle' : user.presence.status === 'offline' ? '<:offline:450674445670154240> Offline' : `<:streaming:450674542717698058> Streaming [${user.presence.game.name}](${user.presence.game.url})`, true);

  // If the user has a nickname
  if (member.nickname) embed.addField('Nickname', member.nickname, true);

  // Display color
  embed.setColor(member.displayColor === 0 ? client.accentColor : member.displayColor);
  embed.addField('Joined', moment(member.joinedAt).format('MMM Do YYYY, h:mm a'), true); // Joined (formatted)
  embed.addField('Registered', moment(user.createdAt).format('MMM Do YYYY, h:mm a'), true); // Registered (formatted)

  // If the member has more than one role
  if (member.roles.cache.size > 1) {
    const roles = member.roles.cache.filter(({ id }) => id !== message.guild.id).map((role) => role.toString()).join(' ').trim(); // Filter out the @everyone role
    embed.addField('Roles', roles.length > 1024 ? `${member.roles.cache.size} roles.` : roles, true); // If the length of the roles string is more than 1024, list it as a number. If not, list out the roles.
  }

  // Profile-related embed fields
  if (await profile.badges !== null) embed.addField('Badges', await profile.badges, true);
  embed.addField('Balance', `${await profile.balance} Cubits`, true);
  embed.addField('Reputation', await profile.reputation, true);

  // If the user has activities
  if (user.presence.activities.length !== 0) {
    let games = '';
    for (const activity of user.presence.activities) {
      let partial = '';

      if (activity.type === 'CUSTOM_STATUS') {
        partial += '**Custom status:** ';
        if (activity.emoji) partial += `<:${activity.emoji.name}:${activity.emoji.id}> `;
        if (activity.state) partial += activity.state;
      }

      if (activity.name === 'Spotify') partial += `**Listening to** ${activity.details} - ${activity.state}`;

      if (activity.type === 'PLAYING') partial += `**Playing** ${activity.name}`;

      partial += '\n';

      games += partial;
    }
    games = games.trim();
    embed.addField('Activities', games);
  }

  message.send(embed).catch((e) => {
    message.send(e);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['whois', 'user', 'profile', 'i'],
  permLevel: 'User',
  requiresEmbed: true
};

exports.help = {
  name: 'userinfo',
  description: 'Shows a user\'s information',
  usage: 'userinfo [user]',
  category: 'User'
};
