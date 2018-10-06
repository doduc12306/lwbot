module.exports.run = async (client, message) => {
  try {
    if (!message.guild.me.permissions.has('MANAGE_NICKNAMES')) return message.channel.send(':x: I do not have permission to manage nicknames!');

    if (message.mentions.users.first()) {
      if (!message.member.permissions.has('MANAGE_NICKNAMES')) return message.channel.send(':x: You do not have permission to change other people\'s nicknames!');

      var targetMember = message.mentions.members.first();
      var targetUser = message.mentions.users.first();

      if (targetMember.nickname && targetMember.nickname.includes('☆ ･*。')) return message.channel.send(':x: That nickname already has a sparkle in it!');

      if (targetMember.nickname && targetMember.nickname.length < 28) {
        await targetMember.setNickname(`☆ ･*。${targetMember.nickname}`);
        await message.channel.send(':white_check_mark: Nickname has been set!');
      }
      else if (targetUser.username.length < 28) {
        await targetMember.setNickname(`☆ ･*。${targetUser.username}`);
        await message.channel.send(':white_check_mark: Nickname has been set!');
      }
      else {message.channel.send(':x: The user\'s nickname/username was too long! Please set it to something less than 28 characters!');}
    } else {
      if (!message.member.permissions.has('CHANGE_NICKNAME')) return message.channel.send(':x: You do not have permission to change your nickname!');

      var selfMember = message.member;
      var selfUser = message.author;

      if (selfMember.nickname && selfMember.nickname.includes('☆ ･*。')) return message.channel.send(':x: You already have a sparkle in your nickname!');

      if (selfMember.nickname && selfMember.nickname.length < 28) {
        await selfMember.setNickname(`☆ ･*。${selfMember.nickname}`);
        await message.channel.send(':white_check_mark: Your nickname was set!');
      } else if (selfUser.username.length < 28) {
        await selfMember.setNickname(`☆ ･*。${selfUser.username}`);
        await message.channel.send(':white_check_mark: Your nickname was set!');
      } else {message.channel.send(':x: Your nickname/username was too long! Please set it to something less than 28 characters!');}
    }
  } catch (err) {
    message.channel.send(`:x: **If you're seeing this, contact James.**\nFATAL ERROR:\`\`\`xl\n${err.stack}\`\`\``);
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