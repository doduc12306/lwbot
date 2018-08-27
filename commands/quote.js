var moment = require('moment');
var Discord = require('discord.js');
module.exports.run = (client, message, args) => {
  if(!args[0]) return message.channel.send(':x: **You didn\'t give the ID of a message to quote!**');

  message.channel.fetchMessage(args[0])
    .then(msg => {
      message.channel.send(new Discord.RichEmbed()
        .setColor(msg.member.displayColor === 0 ? client.config.colors.green : msg.member.displayColor)
        .setAuthor(msg.author.tag, msg.author.avatarURL)
        .setDescription(`*\`\`\`\n"${msg.content}"\n\`\`\`*`)
        .setFooter(`Message created on ${moment(msg.createdTimestamp).format('MMM Do YYYY @ h:mm a')}`)
      );
    })
    .catch(e => {
      if(e.message.includes('Invalid Form Body')) return message.channel.send(':x: **That isn\'t a valid message ID!**');
      else if(e.message.includes('Unknown Message')) return message.channel.send(':x: **I couldn\'t find that message!** `(Is it in the channel?)`');
      else return message.channel.send(`:x: **Something went wrong during the process, the message could not be fetched.**\n:gear: *Debug information:*\n\`\`\`${e}\`\`\``);
    });
};

exports.conf = {
  enabled: true,
  aliases: [],
  guildOnly: true,
  permLevel: 'User'
};

exports.help = {
  name: 'quote',
  description: 'Quote a user based on message ID.\nMessage must be in the same channel as command.',
  usage: 'quote <message ID>',
  category: 'Server'
};