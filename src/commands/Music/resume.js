module.exports.run = (client, message) => {
  const voiceChannel = message.member.voice.channel;
  if(!voiceChannel) return message.send('❌ `|` 🎵 **You aren\'t in a voice channel!**');

  const music = client.musicQueue.get(message.guild.id);
  if(!music) return message.send('❌ `|` 🎵 **There\'s nothing playing!**');

  if(!music.connection.dispatcher.paused) return message.send('❌ `|` 🎵 **Already playing!**');
  music.connection.dispatcher.resume();
  music.playing.interval = setInterval(() => music.playing.duration++, 1000);
  clearTimeout(music.pauseTimeout);
  message.send('▶ `|` 🎵 **Resumed.**');
};

exports.conf = {
  enabled: false,
  aliases: ['▶'],
  permLevel: 'DJ',
  guildOnly: true,
  failoverDisabled: true
};

exports.help = {
  name: 'resume',
  description: 'Resume a paused track',
  usage: 'resume',
  category: 'Music'
};