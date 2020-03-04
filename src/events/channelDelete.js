const { MessageEmbed } = require('discord.js');
module.exports = (client, channel) => {

  if (!channel.guild) return;
  const loggingEnabled = client.events.get(channel.guild.id)['channelDelete'];
  if (!loggingEnabled) return;

  const modLogChannel = channel.guild.channels.cache.find(g => g.name === client.settings.get(channel.guild.id)['modLogChannel']);
  if (!modLogChannel) return;

  const embed = new MessageEmbed()
    .setColor(client.config.colors.red)
    .setTitle('Channel Deleted')
    .setDescription(`Channel: ${channel.name}`)
    .addField('ID', channel.id, true)
    .addField('Type', channel.type, true)
    .setTimestamp(channel.deletedTimestamp);

  modLogChannel.send(embed);
};