module.exports.run = async (client, message) => {
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.send('❌ `|` 🎵 **You aren\'t in a voice channel!**');

  const music = client.musicQueue.get(message.guild.id);
  if (!music) return message.send('❌ `|` 🎵 **There\'s nothing playing!**');

  music.songs = await [];
  music.playing.duration = await 0;
  await clearInterval(music.playing.interval);
  if(music.pauseTimeout) clearTimeout(music.pauseTimeout);
  music.connection.dispatcher.stop('⏹ `|` 🎵 **Stopped.**');
};

exports.conf = {
  enabled: false,
  aliases: ['🛑', '⏹', 'stopmusic', 'disconnect', 'dc', 'stfu', 'shutup', 'sotp', 'sopt'],
  permLevel: 'DJ',
  guildOnly: true
};

exports.help = {
  name: 'stop',
  description: 'Stops the track, clears the queue, and leaves the channel',
  usage: 'stop',
  category: 'Music'
};