/* eslint-disable */
const moment = require('moment');
const { RichEmbed } = require('discord.js');
const { shuffle } = require('lodash');
module.exports.run = async (client, message, args) => {
  const { voiceChannel } = message.member;
  if (!voiceChannel) return message.send(':x: `|` :musical_note: **You aren\'t in a voice channel!**');

  const music = client.musicQueue.get(message.guild.id);
  if (!music) return message.send(':x: `|` :musical_note: **There is nothing playing!**');

  switch (args[0]) {
    case 'list': {
      listQueue();
      break;
    }
    case 'remove': {
      const toRemove = args[1];
      if (!toRemove) return message.send(':x: `|` :musical_note: **You didn\'t give me a number to remove!**');
      if (isNaN(toRemove)) return message.send(`:x: \`|\` :musical_note: \`${toRemove}\` **is not a number!**`);
      if (!music.songs[toRemove]) return message.send(`:x: \`|\` :muscal_note; \`${toRemove}\` **does not exist!**`);

      const removed = music.songs.splice(toRemove, 1);
      message.send(`:white_check_mark: \`|\` :musical_note: \`${removed.title}\` **was removed.**`);
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
        message.send(':white_check_mark: `|` 🔁 **Queue will no longer loop!**');
      } else {
        music.loop = true;
        message.send(':white_check_mark: `|` 🔁 **Queue will now loop!**');
      }
      break;
    }
    case 'shuffle': {
      const firstSong = await music.songs.shift();
      music.songs = await _.shuffle(music.songs);
      await music.songs.unshift(firstSong);

      message.send(':white_check_mark: `|` 🔀 **Shuffled!**');
      break;
    }
    case 'clear': {
      const curSong = music.songs[0].title;
      music.songs.forEach(song => { if (song.title !== curSong) music.songs.splice(music.songs.indexOf(song), 1); });
      client.logger.verbose(music.songs);
      message.send(':white_check_mark: `|` :musical_note: **Cleared queue.**');
      break;
    }
    default: {
      listQueue();
      break;
    }
  }

  function listQueue() {
    const embed = new RichEmbed()
      .setColor(client.config.colors.green)
      .setTimestamp();

    let desc = '\n';
    for (const song of music.songs) {
      const duration = moment.duration(song.duration, 'milliseconds').format('H[:]mm[:]ss');

      if (music.songs.indexOf(song) === 0) {
        desc += `▶ CURRENT SONG\n> ${song.title}`
      } else

        desc += `\n\n${music.songs.indexOf(song)}. ${song.title} (${duration})`
    }
    desc += ''
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
  usage: 'queue [list | remove | add | clear | repeat | shuffle] [# | url]',
  category: 'Music'
};