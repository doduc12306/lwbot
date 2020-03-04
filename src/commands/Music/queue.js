/* eslint-disable */
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
function shuffle(array, size) {
  var index = -1,
      length = array.length,
      lastIndex = length - 1;

  size = size === undefined ? length : size;
  while (++index < size) {
    var rand = baseRandom(index, lastIndex),
        value = array[rand];

    array[rand] = array[index];
    array[index] = value;
  }
  array.length = size;
  return array;
}
function baseRandom(lower, upper) {
  return lower + Math.floor(Math.random() * (upper - lower + 1));
}

module.exports.run = async (client, message, args) => {
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.send('❌ `|` 🎵 **You aren\'t in a voice channel!**');

  const music = client.musicQueue.get(message.guild.id);
  if (!music) return message.send('❌ `|` 🎵 **There is nothing playing!**');

  switch (args[0]) {
    case 'list': {
      listQueue();
      break;
    }
    case 'remove': {
      const toRemove = args[1];
      if (!toRemove) return message.send('❌ `|` 🎵 **You didn\'t give me a number to remove!**');
      if (isNaN(toRemove)) return message.send(`❌ \`|\` 🎵 \`${toRemove}\` **is not a number!**`);
      if (!music.songs[toRemove]) return message.send(`❌ \`|\` :muscal_note; \`${toRemove}\` **does not exist!**`);

      const removed = music.songs.splice(toRemove, 1);
      message.send(`✅ \`|\` 🎵 \`${removed[0].title}\` **was removed.**`);
      break;
    }
    case 'add': {
      args.shift();
      client.commands.get('play').run(client, message, args); // Rather lazy of me, but instead of redefining the functions, I just run the play command again, since it is the same functionality.
      break;
    }
    case 'loop': {
      if (music.loop) {
        music.loop = false;
        message.send('✅ `|` 🔁 **Queue will no longer loop!**');
      } else {
        music.loop = true;
        message.send('✅ `|` 🔁 **Queue will now loop!**');
      }
      break;
    }
    case 'repeat': { // Just a clone of the loop case because I've made this mistake and wondered why it won't work.
      if (music.loop) {
        music.loop = false;
        message.send('✅ `|` 🔁 **Queue will no longer loop!**');
      } else {
        music.loop = true;
        message.send('✅ `|` 🔁 **Queue will now loop!**');
      }
      break;
    }
    case 'shuffle': {
      const curSong = music.songs[0];
      const curSongFromSplice = music.songs.splice(music.songs.indexOf(curSong), 1)[0];
      music.songs = shuffle(music.songs);
      music.songs.unshift(curSongFromSplice);

      message.send('✅ `|` 🔀 **Shuffled!**');
      break;
    }
    case 'clear': {
      const curSong = music.songs[0].title;
      music.songs.forEach(song => { if (song.title !== curSong) music.songs.splice(music.songs.indexOf(song), 1); });
      client.logger.verbose(music.songs);
      message.send('✅ `|` 🎵 **Cleared queue.**');
      break;
    }
    default: {
      listQueue();
      break;
    }
  }

  function listQueue() {
    const embed = new MessageEmbed()
      .setColor(client.accentColor)
      .setTimestamp();

    let desc = '\n';
    for (const song of music.songs) {
      const duration = moment.duration(song.duration, 'milliseconds').format('H[:]mm[:]ss');

      if (music.songs.indexOf(song) === 0) {
        desc += `▶ CURRENT SONG\n> ${song.title} (${duration})`
      } else

        desc += `\n\n${music.songs.indexOf(song)}. ${song.title} (${duration})`
    }
    if(music.loop) desc += '\n\n> Queue will loop'

    embed.setDescription(desc);
    message.send(desc, { code: 'markdown', split: true });
  }
};

exports.conf = {
  enabled: true,
  aliases: ['q', 'tracks', 'tracklist'],
  permLevel: 'User',
  guildOnly: true,
  requiresEmbed: true
};

exports.help = {
  name: 'queue',
  description: 'The queue of the tracks in the guild',
  usage: 'queue [list | remove <#> | add <name or url> | clear | repeat | loop | shuffle]',
  category: 'Music'
};