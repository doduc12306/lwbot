module.exports.run = async (client, message) => {
  try {
    if (!message.guild.me.permissions.has('MANAGE_NICKNAMES')) return message.send('❌ **I do not have permission to manage nicknames!**');

    if (message.mentions.users.first()) {
      if (!message.member.permissions.has('MANAGE_NICKNAMES')) return message.send('❌ **You do not have permission to change other people\'s nicknames!**');

      const targetMember = message.mentions.members.first();
      const targetUser = message.mentions.users.first();

      if (targetMember.highestRole.position > message.guild.me.highestRole.position) return message.send('❌ **The member\'s role is higher than mine!**');
      if (targetMember.nickname && targetMember.nickname.includes('☆ ･*。')) return message.send('❌ **That nickname already has a sparkle in it!**');

      if (targetMember.nickname && targetMember.nickname.length < 28) {
        await targetMember.setNickname(`☆ ･*。${targetMember.nickname}`);
        await message.send('✅ **Nickname has been set!**');
      }
      else if (targetUser.username.length < 28) {
        await targetMember.setNickname(`☆ ･*。${targetUser.username}`);
        await message.send('✅ **Nickname has been set!**');
      }
      else {message.send('❌ **The user\'s nickname/username was too long! Please set it to something less than 28 characters!**');}
    } else {
      if (!message.member.permissions.has('CHANGE_NICKNAME')) return message.send('❌ **You do not have permission to change your nickname!**');

      const selfMember = message.member;
      const selfUser = message.author;

      if (selfMember.highestRole.position > message.guild.me.highestRole.position) return message.send('❌ **Your role is higher than mine!**');
      if (selfMember.nickname && selfMember.nickname.includes('☆ ･*。')) return message.send('❌ **You already have a sparkle in your nickname!**');

      if (selfMember.nickname && selfMember.nickname.length < 28) {
        await selfMember.setNickname(`☆ ･*。${selfMember.nickname}`);
        await message.send('✅ **Your nickname was set!**');
      } else if (selfUser.username.length < 28) {
        await selfMember.setNickname(`☆ ･*。${selfUser.username}`);
        await message.send('✅ **Your nickname was set!**');
      } else {message.send('❌ **Your nickname/username was too long! Please set it to something less than 28 characters!**');}
    }
  } catch (err) {
    message.send(`❌ **If you're seeing this, contact my owner.**\nERROR:\`\`\`xl\n${err.stack}\`\`\``);
  }
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: 'User',
  guildOnly: true
};

exports.help = {
  name: 'sparkle',
  description: 'Make your nickname sparkly!',
  usage: 'sparkle [@user (MOD ONLY)]',
  category: 'Fun'
};