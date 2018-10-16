/* eslint-disable */
module.exports.run = (client, message, args) => {
  if(!message.guild.me.permissions.has('MANAGE_MESSAGES')) return message.channel.send(':x: `|` :bomb: **I am missing permissions to Manage Messages!**');
  if(!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send(':x: `|` :bomb: **You do not have permissions to Manage Messages!**');

  var toPurge = args[0];

  if(!toPurge) return message.channel.send(':x: `|` :bomb: **You didn\'t give an amount to purge!**');
  if(toPurge > 100) return message.channel.send(':x: `|` :bomb: **Due to the limitations of Discord, I can only delete 100 messages at a time!**');

  message.channel.bulkDelete(toPurge)
    .then(messages => message.channel.send(`:white_check_mark: \`|\` :bomb: **Deleted \`${messages.size}\` messages!**`))
    .catch(e => message.channel.send(`:x: \`|\` :bomb: **Error!** ${e}`));
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['clear', 'prune'],
  permLevel: 'Moderator'
};

exports.help = {
  name: 'purge',
  description: 'Remove x amount of messages from the channel',
  usage: 'purge <number ≤ 100>',
  category: 'Moderation'
};