module.exports.run = (client, message) => {
  const voiceChannel = message.member.voice.channel;
  if(!voiceChannel) return message.send('❌ `|` 🎵 **You aren\'t in a voice channel!**');

  const music = client.musicQueue.get(message.guild.id);
  if(!music) return message.send('❌ `|` 🎵 **There\'s no music playing!');

  if(music.connection.dispatcher.paused) return message.send('❌ `|` 🎵 **Already paused!**');
  music.connection.dispatcher.pause();
  clearInterval(music.playing.interval);
  message.send('⏸ `|` 🎵 **Paused.**');

  music.pauseTimeout = setTimeout(async () => {
    music.songs = await [];
    music.playing.duration = await 0;
    await clearInterval(music.playing.interval);
    music.connection.dispatcher.stop('⏱ `|` 🎵 **I left because I was paused for more than 5 minutes.**');
  }, 300000); // 5 minutes
};

exports.conf = {
  enabled: false,
  aliases: ['⏸'],
  permLevel: 'DJ',
  guildOnly: true
};

exports.help = {
  name: 'pause',
  description: 'Pause the current song',
  usage: 'pause',
  category: 'Music'
};