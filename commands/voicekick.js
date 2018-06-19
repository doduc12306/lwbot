/* eslint-disable */
module.exports.run = async (client, message, args) => {
  if(!message.guild.me.permissions.has(`MOVE_MEMBERS`)) return message.channel.send(`:x: I'm missing the Move Members permission!`);
  if(!message.member.voiceChannel) return message.channel.send(`:x: You are not in a voice channel!`);
  if(!message.mentions.members.first()) return message.channel.send(`:x: You didn't mention a member to voice kick!`);
  if(!message.mentions.members.first().voiceChannel) return message.channel.send(`:x: The member you are trying to voice kick isn't in a voice channel!`);
    
  message.mentions.members.first().voiceChannel.overwritePermissions(message.mentions.users.first(), {CONNECT: false});
  setTimeout(() => {
    var chnlPerms = message.member.voiceChannel.permissionOverwrites;
    chnlPerms.get(message.mentions.users.first().id).delete();
  }, 300000);
  
  var kickChannel = await message.guild.createChannel(`Voice Kick`, `voice`);
  await message.mentions.members.first().setVoiceChannel(kickChannel);
  await kickChannel.delete(); 
};

exports.conf = {
  enabled: true,
  permLevel: `Moderator`,
  aliases: [`vk`, `kickvoice`],
  guildOnly: true
};

exports.help = {
  name: `voicekick`,
  description: `Kicks a mentioned user from a voice channel`,
  usage: `voicekick <@user>`,
  category: `Server`
};