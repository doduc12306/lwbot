const { RichEmbed } = require('discord.js');
module.exports = (client, message) => {
  if(message.author.bot) return;

  if (!message.guild) return;
  const loggingEnabled = client.events.get(message.guild.id)['messageDelete'];
  if (!loggingEnabled) return;

  const modLogChannel = message.guild.channels.find(g => g.name === client.settings.get(message.guild.id)['modLogChannel']);
  if (!modLogChannel) return;

  if(message.content.length > 1024) message.content = message.content.substring(0, 1020) + ' ...';

  const embed = new RichEmbed()
    .setColor(client.config.colors.red)
    .setAuthor(message.author.tag, message.author.displayAvatarURL, message.url)
    .setTitle('Message Deleted')
    .setDescription(`Channel: ${message.channel.toString()}`)
    .addField('Message', message.content)
    .setTimestamp(message.deletedTimestamp);

  modLogChannel.send(embed);
};