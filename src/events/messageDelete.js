const { MessageEmbed } = require('discord.js');
module.exports = (client, message) => {
  // If bot is in failover mode, don't load this module.
  if (global.failover) return;

  if(message.author.bot) return;

  if (!message.guild) return;
  const loggingEnabled = client.events.get(message.guild.id)['messageDelete'];
  if (!loggingEnabled) return;

  const modLogChannel = message.guild.channels.cache.find(g => g.name === client.settings.get(message.guild.id)['modLogChannel']);
  if (!modLogChannel) return;

  if(message.content.length > 1024) message.content = message.content.substring(0, 1020) + ' ...';

  const embed = new MessageEmbed()
    .setColor(client.config.colors.red)
    .setAuthor(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }), message.url)
    .setTitle('Message Deleted')
    .setDescription(`Channel: ${message.channel.toString()}`)
    .addField('Message', message.content)
    .setTimestamp(message.deletedTimestamp);

  modLogChannel.send(embed);
};