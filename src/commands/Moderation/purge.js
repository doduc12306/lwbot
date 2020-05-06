module.exports.run = async (client, message, args) => {
  if (!message.guild.me.permissions.has('MANAGE_MESSAGES')) return message.send('❌ `|` 💣 **I am missing permissions to Manage Messages!**');
  if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.send('❌ `|` 💣 **You do not have permissions to Manage Messages!**');

  let toPurge = args[0];

  if (!toPurge) return message.send('❌ `|` 💣 **You didn\'t give an amount to purge!**');
  if (toPurge > 500) return message.send('❌ `|` 💣 **That amount is too large!** Please choose something up to 500.');
  
  while(toPurge >= 100) {
    await message.channel.bulkDelete(100);
    toPurge = toPurge - 100;
    await client.wait(1000);
  }

  const leftover = toPurge % 100;
  if(leftover > 1) await message.channel.bulkDelete(leftover);

  await message.send(`✅ \`|\` 💣 **Purged ${args[0]} messages!**`);

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