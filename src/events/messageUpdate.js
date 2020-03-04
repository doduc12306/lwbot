const { MessageEmbed } = require('discord.js');
module.exports = async (client, oldMessage, newMessage) => {
  if(newMessage.author.bot) return;
  
  let command = false;
  if (client.msgCmdHistory[newMessage.id]) {
    newMessage.edited = true;
    command = true;
    client.emit('message', newMessage);
  }

  if (!newMessage.guild) return;
  const loggingEnabled = client.events.get(newMessage.guild.id)['messageUpdate'];
  if (!loggingEnabled) return;

  const modLogChannel = newMessage.guild.channels.cache.find(g => g.name === client.settings.get(newMessage.guild.id)['modLogChannel']);
  if (!modLogChannel) return;

  if(oldMessage.content.length > 1024) oldMessage.content = oldMessage.content.substring(0, 1020) + ' ...';
  if(newMessage.content.length > 1024) newMessage.content = newMessage.content.substring(0, 1020) + ' ...';

  const embed = new MessageEmbed()
    .setColor(client.accentColor)
    .setAuthor(newMessage.author.tag, newMessage.author.displayAvatarURL({ format: 'png', dynamic: true }), newMessage.url)
    .setTitle(`${command ? 'Command' : 'Message'} Edited`)
    .setDescription(`Channel: ${newMessage.channel.toString()}`)
    .addField('Old Message', oldMessage.content)
    .addField('New Message', newMessage.content)
    .setTimestamp(newMessage.createdTimestamp);

  modLogChannel.send(embed);
};