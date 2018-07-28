const Discord = require(`discord.js`);
var moment = require('moment');

module.exports.run = (client, message, args) => {
  try {
    var user = message.mentions.users.first() ? message.mentions.users.first() : message.author;
    var userM = message.mentions.members.first() ? message.mentions.members.first() : message.member;

  var embed = new Discord.RichEmbed()
    .setAuthor(user.tag, user.avatarURL)
    .addField('ID', user.id, true)
    .setThumbnail(user.avatarURL)
    .setDescription(user.toString());

  var status;
  if(user.presence.status === "online") status = '<:online:450674128777904149> Online'
  else if(user.presence.status === "offline") status = '<:offline:450674445670154240> Offline'
  else if(user.presence.status === "dnd") status = '<:dnd:450674354163023882> Do Not Disturb'
  else if(user.presence.status === "idle") status = '<:idle:450674222176403456> Idle'
  else if(user.presence.game.streaming) status = `<:streaming:450674542717698058> Streaming [${user.presence.game.name}](${user.presence.game.url})`
  embed.addField('Status', status, true);

  if(user.presence.game){
    if(!user.presence.game.streaming) embed.addField('Game', user.presence.game.name, true)
  }

  if(userM.nickname) embed.addField('Nickname', userM.nickname, true);

  if(userM.displayColor === 0) embed.setColor(client.config.colors.green);
  else embed.setColor(userM.displayColor);

  embed.addField('Joined', moment(userM.joinedAt).format('MMM Do YYYY, h:mm a'), true);
  embed.addField('Registered', moment(user.createdAt).format('MMM Do YYYY, h:mm a'), true);

  if(userM.roles.map(g => g.toString()).join(' ').trim() !== '@everyone') {
    var roles = userM.roles.map(g => g.toString())
      .join(' ')
      .split('@everyone')
      .join(' ')
      .trim();

    if(roles.length > 1024) embed.addField('Roles', `Too long. ${user.toString()} has ${userM.roles.map(g => g.toString()).size} roles.`, true);
    else embed.addField('Roles', roles, true);
  }

  message.channel.send(embed).catch(e => message.channel.send(e));
  } catch (e) {
    message.channel.send(e.stack);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [`whois`, `user`],
  permLevel: `User`
};

exports.help = {
  name: `userinfo`,
  description: `Shows a user's information`,
  usage: `userinfo [user]`,
  category: `Misc`
};