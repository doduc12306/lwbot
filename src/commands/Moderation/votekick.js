/* eslint-disable */
const GuildSettings = require('../../dbFunctions/message/settings');
module.exports.run = (client, message, args) => {
  const GuildSettings = require('../../dbFunctions/message/settings');
  const settings = new GuildSettings(message.guild.id);
  const toKick = message.mentions.users.first();
  const toKickM = message.mentions.members.first();
  const reason = args.slice(1).join(' ');

  if (!message.guild.me.permissions.has('KICK_MEMBERS')) return message.send('❌ `|` 👢 **I am missing permissions:** `Kick Members`');
  if (!toKick) return message.send('❌ `|` 👢 **You didn\'t mention someone to kick!**');
  if (!toKickM.kickable) return message.send('❌ `|` 👢 **This member could not be kicked!**');

  message.send(`:warning: \`|\` :boot: **Votekick user \`${toKick.tag}\`?** (30 seconds)`).then(async msg => {
    await msg.react('✅');
    await msg.react('❌');

    const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name);
    const collector = await msg.createReactionCollector(filter, { time: 3000 })
      .on('end', () => {
        let yesVotes = msg.reactions.get('✅').users.filter(g => !g.bot);
        let noVotes = msg.reactions.get('❌').users.filter(g => !g.bot);

        let yesVotesCount = yesVotes.size;
        let noVotesCount = noVotes.size;

        if(yesVotes.has(message.author.id)) yesVotesCount--; // subtract 1 from yesVotesCount because the author cast a vote on their own vk
        if(noVotes.has(message.author.id)) noVotesCount--; // subtract 1 from noVotesCount because the author cast a vote on their own vk

        if(yesVotesCount + noVotesCount < 5) return msg.edit(`❌ \`|\` :boot: **Not enough votes were cast to kick \`${toKick.tag}\`.** (Minimum: 5)`);

        if(yesVotesCount > noVotesCount) {
          msg.edit(`✅ \`|\` :boot: **Votekicked \`${toKick.tag}\`.** \`${yesVotesCount}\`/\`${noVotesCount}\``);
        } else {
          msg.edit(`❌ \`|\` :boot: **Did not votekick \`${toKick.tag}\`.** \`${yesVotesCount}\`/\`${noVotesCount}\``);
        }

        msg.reactions.removeAll();
      });
  });
};

exports.conf = {
  enabled: false,
  aliases: ['vk'],
  permLevel: 'User',
  guildOnly: true,
  //cooldown: 60000, // 1 minute
  disabledReason: 'Unfinished command'
};

exports.help = {
  name: 'votekick',
  description: 'Vote to kick a user',
  usage: 'votekick <@user> [reason]',
  category: 'Moderation'
};