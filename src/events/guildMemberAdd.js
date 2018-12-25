// This event executes when a new member joins a server. Let's welcome them!
module.exports = async (client, member) => {
  if(member.user.bot) return;
  let welcomeEnabled;
  await member.guild.settings.get('welcomeEnabled').then(value => welcomeEnabled = value).catch(e => client.logger.error(e));
  let welcomeMessage;
  await member.guild.settings.get('welcomeMessage').then(value => welcomeMessage = value).catch(e => client.logger.error(e));
  let welcomeChannel;
  await member.guild.settings.get('welcomeChannel').then(value => welcomeChannel = value).catch(e => client.logger.error(e));

  if(welcomeEnabled !== 'true') return;
  welcomeChannel = member.guild.channels.find(channel => channel.name === welcomeChannel);
  if(welcomeChannel === null) return;
  welcomeChannel.send(welcomeMessage.replaceAll('{{user}}', member.user.toString()));
};
