const { RichEmbed } = require('discord.js');
const moment = require('moment');
module.exports.run = (client, message) => {
  const { voiceChannel } = message.member;
  if(!voiceChannel) return message.send('❌ `|` 🎵 **You aren\'t in a voice channel!**');

  const music = client.musicQueue.get(message.guild.id);
  if(!music) return message.send('❌ `|` 🎵 **There\'s nothing playing!**');

  let progressBar = '';
  const percentage = music.connection.dispatcher.time / music.songs[0].duration; // DO NOT MULTIPLY THIS BY 100! IT'S IN DECIMAL FORM FOR A REASON!
  const section1 = Math.ceil(20 * percentage);
  const section2 = Math.floor(20 * (1 - percentage));
  progressBar += `${'▬'.repeat(section1)}🔘${'▬'.repeat(section2)}`;

  const timeElapsed = moment.duration(music.playing.duration, 'seconds').format('H[:]mm[:]ss');
  const totalTime = moment.duration(music.songs[0].duration, 'milliseconds').format('H[:]mm[:]ss');

  message.send(new RichEmbed()
    .setColor(client.config.colors.accentColor)
    .setTitle(music.songs[0].title)
    .setURL(music.songs[0].url)
    .setThumbnail(music.songs[0].thumbnail)
    .setDescription(`${timeElapsed} ${progressBar} ${totalTime}`)
  );
};

exports.conf = {
  enabled: true,
  aliases: ['np', 'playing', 'whatisthissong'],
  permLevel: 'User',
  guildOnly: true,
  requiresEmbed: true
};

exports.help = {
  name: 'nowplaying',
  description: 'Shows what song is currently playing',
  usage: 'nowplaying',
  category: 'Music'
};