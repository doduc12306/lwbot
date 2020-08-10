module.exports.run = async (client, message) => {
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.send('❌ `|` 🎵 **You aren\'t in a voice channel!**');

  const music = client.musicQueue.get(message.guild.id);
  if (!music) return message.send('❌ `|` 🎵 **There\'s nothing playing!**');

  music.songs = await []; // Reset the queue
  music.playing.duration = await 0;
  await clearInterval(music.playing.interval);
  if(music.pauseTimeout) clearTimeout(music.pauseTimeout);
  message.send('⏹ `|` 🎵 **Stopped.**');
  music.connection.dispatcher.destroy(); // Destroy the dispatcher (stop music)
  music.connection.channel.leave(); // Leave the voice channel
  client.musicQueue.delete(message.guild.id); // Remove the server object from the musicQueue collection.
};

exports.conf = {
  enabled: false,
  aliases: ['🛑', '⏹', 'stopmusic', 'disconnect', 'dc', 'stfu', 'shutup', 'sotp', 'sopt'],
  permLevel: 'DJ',
  guildOnly: true,
  failoverDisabled: true
};

exports.help = {
  name: 'stop',
  description: 'Stops the track, clears the queue, and leaves the channel',
  usage: 'stop',
  category: 'Music'
};