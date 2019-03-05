const Discord = require('discord.js');
module.exports.run = (client, message, args) => {
  if(message.mentions.members.size === 0) {
    if(!args[0]) return message.send('❌ **You didn\'t give the ID of a message to quote!**');
  }

  if(message.mentions.members.size !== 0) {
    const member = message.mentions.members.first();
    message.send(new Discord.RichEmbed()
      .setColor(member.displayColor === 0 ? client.config.colors.green : member.displayColor)
      .setAuthor(member.user.tag, member.user.avatarURL)
      .addField('Message', member.lastMessage.content)
      .addField('Jump To Message', `https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${member.lastMessageID}`)
      .setTimestamp(member.lastMessage.createdTimestamp)
    );
  } else {
    message.channel.fetchMessage(args[0])
      .then(msg => {
        message.send(new Discord.RichEmbed()
          .setColor(msg.member.displayColor === 0 ? client.config.colors.green : msg.member.displayColor)
          .setAuthor(msg.author.tag, msg.author.avatarURL)
          .addField('Message', msg.content)
          .addField('Jump To Message', `https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${msg.id}`)
          .setTimestamp(msg.createdTimestamp)
        );
      })
      .catch(e => {
        if (e.message.includes('Invalid Form Body')) return message.send('❌ **That isn\'t a valid message ID!**');
        else if (e.message.includes('Unknown Message')) return message.send('❌ **That message could not be found in the current channel!**');
        else return message.send(`❌ **Something went wrong during the process, the message could not be fetched.**\n⚙️ *Debug information:*\n\`\`\`${e}\`\`\``);
      });
  }
};

exports.conf = {
  enabled: true,
  aliases: [],
  guildOnly: true,
  permLevel: 'User',
  requiresEmbed: true
};

exports.help = {
  name: 'quote',
  description: 'Quote a user based on message ID or @mention',
  usage: 'quote <message ID / @mention>',
  category: 'Server'
};