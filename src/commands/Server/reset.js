module.exports.run = async (client, message) => {

  const response = await client.awaitReply(message, ':warning: `|` 🔄 **In order to reset, I will have to leave the guild and you will need to reinvite me.**\nAre you **SURE** you want to do this? **THIS CANNOT BE UNDONE**');

  if (!response) return message.send('❌ `|` 🔄 **Reset cancelled.**');

  if (/y(es)?/gi.test(response)) {
    const invite = await client.generateInvite(['KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'ADD_REACTIONS', 'VIEW_AUDIT_LOG', 'STREAM', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'CONNECT', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'CHANGE_NICKNAME', 'MANAGE_NICKNAMES', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'MANAGE_EMOJIS']);

    await message.send(`:warning: \`|\` 🔄 **Leaving server...**\nInvite me back with this link:\n<${invite}>`);
    await message.guild.leave();
  } else if (/no?/gi.test(response)) {
    message.send('❌ `|` 🔄 **Reset cancelled.**');
  } else return message.send('❌ `|` 🔄 **Response not recognized.**');
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['resetserver', 'resetguild', 'resetall'],
  permLevel: 'Bot Commander'
};

exports.help = {
  name: 'reset',
  description: 'Resets the server back to default settings/XP',
  usage: 'reset',
  category: 'Server'
};