const Discord = require(`discord.js`);

module.exports.run = (client, message) => {
    
  if (message.mentions.users.size < 1) {
        
    //Finds the author nickname
    if (message.member.nickname) {var authorNick = message.member.nickname;} else {authorNick = `None`;}
        
    //Finds the author game and/or game URL
    if (message.author.presence.game) {var authorGame = message.author.presence.game.name;} else {authorGame = `None`;}
        
    //Finds the author presence status
    if (message.author.presence.status === `online`) {var authorStatus = `Online`;}
    else if (message.author.presence.status === `idle`) {authorStatus = `Idle`;}
    else if (message.author.presence.status === `dnd`) {authorStatus = `Do Not Disturb`;}
    else if (message.author.presence.status === `offline`) {authorStatus = `Offline`;}

    //Finds the author join date
    var authorJoined = new Date(message.member.joinedTimestamp);

    //Finds the author registered date
    var authorRegistered = new Date(message.author.createdTimestamp);

    //Finds the author's avatar
    if (message.author.avatarURL) {var authorAvatar = message.author.avatarURL;}
    else {authorAvatar = `https://cdn.discordapp.com/embed/avatars/1.png?width=80&height=80`;}

    //Finds the author's color
    if (message.member.displayColor) {var authorColor = message.member.displayColor;} else {authorColor = `0x59D851`;}

    //The actual message
    message.channel.send(new Discord.RichEmbed()
      .setColor(authorColor)
      .setThumbnail(authorAvatar)
      .setAuthor(message.author.tag, message.author.avatarURL)
      .addField(`ID:`, message.author.id, true)
      .addField(`Nickname:`, authorNick, true)
      .addField(`Status:`, authorStatus, true)
      .addField(`Game:`, authorGame, true)
      .addField(`Joined:`, authorJoined.toLocaleString(), true)
      .addField(`Registered:`, authorRegistered.toLocaleString(), true)
      .addField(`Roles:`, message.member.roles.map(g => g.name).join(`, `), true)
    );
  } else if (message.mentions.users.size > 1) {
    message.channel.send(`:x: You are mentioning too many users.`);
  } else {
    //Finds the user's nickname
    if (message.mentions.members.first().nickname) {var mentionedNick = message.mentions.members.first().nickname;}
    else {mentionedNick = `None`;}

    //Finds the user's presence status
    if (message.mentions.users.first().presence.status === `online`) {var mentionedStatus = `Online`;}
    else if (message.mentions.users.first().presence.status === `idle`) { mentionedStatus = `Idle`;}
    else if (message.mentions.users.first().presence.status === `dnd`) { mentionedStatus = `Do Not Disturb`;}
    else if (message.mentions.users.first().presence.status === `offline`) { mentionedStatus = `Offline`;}

    //Finds the user's game
    if (message.mentions.users.first().presence.game) {var mentionedGame = message.mentions.users.first().presence.game.name;}
    else {mentionedGame = `None`;}

    //Finds the user's join date/time
    var mentionedJoined = new Date(message.mentions.members.first().joinedTimestamp);

    //Finds the user's register date/time
    var mentionedRegistered = new Date(message.mentions.users.first().createdTimestamp);

    //Finds the user's avatar
    if (message.mentions.users.first().avatarURL) {var mentionedAvatar = message.mentions.users.first().avatarURL;}
    else {mentionedAvatar = `https://cdn.discordapp.com/embed/avatars/1.png?width=80&height=80`;}

    //Finds the user's color
    if (message.mentions.users.first().displayColor) {var mentionedColor = message.mentions.users.first().displayColor;} else {mentionedColor = `0x59D851`;}
        
    //The actual message
    message.channel.send(new Discord.RichEmbed()
      .setColor(mentionedColor)
      .setThumbnail(mentionedAvatar)
      .setAuthor(message.mentions.users.first().tag, mentionedAvatar)
      .addField(`ID:`, message.mentions.users.first().id, true)
      .addField(`Nickname:`, mentionedNick, true)
      .addField(`Status:`, mentionedStatus, true)
      .addField(`Game:`, mentionedGame, true)
      .addField(`Joined:`, mentionedJoined.toLocaleString(), true)
      .addField(`Registered:`, mentionedRegistered.toLocaleString(), true)
      .addField(`Roles`, message.mentions.members.first().roles.map(g => g.name).join(`, `), true)
    );
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