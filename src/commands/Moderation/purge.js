module.exports.run = (client, message, args) => {
  if(!message.guild.me.permissions.has('MANAGE_MESSAGES')) return message.send('❌ `|` :bomb: **I am missing permissions to Manage Messages!**');
  if(!message.member.permissions.has('MANAGE_MESSAGES')) return message.send('❌ `|` :bomb: **You do not have permissions to Manage Messages!**');

  const toPurge = args[0];

  if(!toPurge) return message.send('❌ `|` :bomb: **You didn\'t give an amount to purge!**');
  if(toPurge > 100) return message.send('❌ `|` :bomb: **Due to the limitations of Discord, I can only delete 100 messages at a time!**');

  message.channel.bulkDelete(toPurge)
    .then(messages => message.send(`✅ \`|\` :bomb: **Deleted \`${messages.size}\` messages!**`))
    .catch(e => message.send(`❌ \`|\` :bomb: **Error!** ${e}`));
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