const { MessageEmbed } = require('discord.js');
module.exports.run = async (client, message) => {
  message.send(new MessageEmbed()
    .setColor(client.accentColor)
    .setTitle('Invite me to another server!')
    .setDescription(await client.generateInvite([
      'CREATE_INSTANT_INVITE', 
      'KICK_MEMBERS', 
      'BAN_MEMBERS', 
      'MANAGE_CHANNELS', 
      'MANAGE_GUILD', 
      'ADD_REACTIONS', 
      'VIEW_AUDIT_LOG', 
      'READ_MESSAGES', 
      'SEND_MESSAGES', 
      'MANAGE_MESSAGES', 
      'EMBED_LINKS', 
      'ATTACH_FILES', 
      'READ_MESSAGE_HISTORY', 
      'USE_EXTERNAL_EMOJIS',
      'CONNECT', 
      'SPEAK', 
      'MUTE_MEMBERS', 
      'DEAFEN_MEMBERS', 
      'USE_VAD', 
      'CHANGE_NICKNAME', 
      'MANAGE_ROLES', 
      'MANAGE_WEBHOOKS', 
      'MANAGE_EMOJIS', 
      'STREAM'
    ]))
  );
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: 'Bot Owner',
  guildOnly: false
};

exports.help = {
  name: 'invite',
  description: 'Invite the bot to another server',
  usage: 'invite',
  category: 'System'
};