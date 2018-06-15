/* eslint-disable */
module.exports.run = async (client, message, args) => {
  if(!message.guild.me.permissions.has(`MOVE_MEMBERS`)) return message.channel.send(`\`❌\` I'm missing the Move Members permission!`);
  if(!message.member.voiceChannel) return message.channel.send(`:x: You are not in a voice channel!`);
  if(!message.mentions.members.first()) return message.channel.send(`\`❌\` You didn't mention a member to voice ban!`);
  if(!message.mentions.members.first().voiceChannel) return message.channel.send(`:x: The member you are trying to voice ban isn't in a voice channel!`);
    
  message.mentions.members.first().voiceChannel.overwritePermissions(message.mentions.users.first(), {CONNECT: false});
  
  var kickBan = await message.guild.createChannel(`Voice Ban`, `voice`);
  await message.mentions.members.first().setVoiceChannel(kickBan);
  await kickBan.delete(); 
};

exports.conf = {
  enabled: true,
  permLevel: `Moderator`,
  aliases: [`vb`, `banvoice`],
  guildOnly: true
};

exports.help = {
  name: `voiceban`,
  description: `Bans a mentioned user from a voice channel`,
  usage: `voiceban <@user>`,
  category: `Server`
};