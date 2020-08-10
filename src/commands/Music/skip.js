module.exports.run = (client, message) => {
  require('../../dbFunctions/client/protos.js')(client);
  const voiceChannel = message.member.voice.channel;
  if(!voiceChannel) return message.send('❌ `|` 🎵 **You aren\'t in a voice channel!**');

  const music = client.musicQueue.get(message.guild.id);
  if(!music) return message.send('❌ `|` 🎵 **There isn\'t anything playing!**');

  const vcMembers = voiceChannel.members.filter(g => !g.user.bot);
  if(vcMembers.size === 1 || client.permlevel(message.member) >= 2) {
    music.playing.duration = 0;
    message.send('⏭ `|` 🎵 **Skipped**');
    music.connection.dispatcher.destroy();
  } else {
    const skipsNeeded = vcMembers.size.isEven()
      ? () => { return vcMembers.size / 2 + 1; } // If it's even, return the majority of the users. Ex: 10. 10 / 2 + 1 = 6
      : () => { return Math.ceil(vcMembers.size / 2); };
    let skipsGathered = 0;
    message.send(`⚠️ \`|\` 🎵 **${skipsNeeded} skip reactions are needed to skip this song.** (Expires in 30 seconds)`).then(msg => {

      msg.react('⏭');

      const filter = (reaction, user) => reaction.emoji.name === '⏭' && message.member.voiceChannel.members.get(user.id);
      const collector = msg.createReactionCollector(filter, { time: 30000 })
        .on('collect', () => {
          skipsGathered++;
          if(skipsGathered >= skipsNeeded) {
            message.send('⏭ `|` 🎵 **Skipped**');
            music.connection.dispatcher.destroy();
            collector.emit('end');
          }
        })
        .on('end', () => { msg.reactions.removeAll(); });
    });
  }

  if(music.pauseTimeout) clearTimeout(music.pauseTimeout); // I have a feeling this might cause an issue if I don't include it here so I will preemptively.
};

exports.conf = {
  enabled: false,
  aliases: ['notthissong', 'thissongsucks', 'idontwannahearthissonganymore'],
  permLevel: 'User',
  guildOnly: true,
  failoverDisabled: true
};

exports.help = {
  name: 'skip',
  description: 'Skip the current track | Requires majority agreement if not DJ or more than 2 people.',
  usage: 'skip',
  category: 'Music'
};