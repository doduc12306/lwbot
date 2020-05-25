const { MessageEmbed } = require('discord.js');
module.exports = (client, member) => {
  const loggingEnabled = client.events.get(member.guild.id)['guildMemberAdd'];
  if (!loggingEnabled) return;

  const modLogChannel = member.guild.channels.cache.find(g => g.name === client.settings.get(member.guild.id)['modLogChannel']);
  if (!modLogChannel) return;

  const embed = new MessageEmbed()
    .setColor(client.config.colors.green)
    .setTitle('Member Joined')
    .addField('Member', `${member.user.toString()} (${member.user.tag})`)
    .setFooter(member.user.id)
    .setTimestamp(member.joinedTimestamp);

  modLogChannel.send(embed);
};