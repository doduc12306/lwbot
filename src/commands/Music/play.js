const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.GOOGLE_API_KEY);
const ytdl = require('ytdl-core');
const { Util } = require('discord.js');
const parse = require('parse-duration');

module.exports.run = async (client, message, args) => {
  require('../../modules/client/misc.js')(client); // For awaitReply function
  require('../../modules/message/misc.js')(client, message);

  const { voiceChannel } = message.member;
  if (!voiceChannel) return message.send('❌ `|` 🎵 **You aren\'t in a voice channel!**');
  if (!message.guild.me.permissionsIn(voiceChannel).serialize()['CONNECT']) return message.send(`❌ \`|\` 🎵 **Missing permissions to connect to** \`${voiceChannel.name}\`**!**`);
  if (!message.guild.me.permissionsIn(voiceChannel).serialize()['SPEAK']) return message.send(`❌ \`|\` 🎵 **Missing permissions to speak in** \`${voiceChannel.name}\`**!**`);

  if (client.musicQueue.get(message.guild.id) && client.musicQueue.get(message.guild.id).connection.dispatcher.paused && client.permlevel(message.member) >= 2) {
    client.musicQueue.get(message.guild.id).connection.dispatcher.resume();
    client.musicQueue.get(message.guild.id).playing.interval = setInterval(() => client.musicQueue.get(message.guild.id).playing.duration++, 1000);
    message.send('▶ `|` 🎵 **Resumed.**');
    return;
  }

  const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
  const searchString = args.slice(0).join(' ');

  if (!url || !searchString) return message.send('❌ `|` 🎵 **You didn\'t give me a URL or search!**');

  // Playlist handling
  if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
    const playlist = await youtube.getPlaylist(url);
    const videos = await playlist.getVideos();
    for (const video of Object.values(videos)) {
      const video2 = await youtube.getVideoByID(video.id);
      handleVideo(video2, message, voiceChannel, true);
    }
    return message.send(`✅ \`|\` 🎵 \`${playlist.title}\` **added to the queue!**`);
  } else {
    let video;
    try {
      video = await youtube.getVideo(url);
    } catch (error) {
      let response;
      try {
        const videos = await youtube.searchVideos(searchString, 5);
        let index = 0;
        if(videos.length === 0) return message.send(`:x: \`|\` **Your search** \`${searchString}\` **did not return any results.**`);
        try {
          response = await client.awaitReply(message, `:mag: \`|\` 🎵 **Please select a song**\n\n${videos.map(video2 => `**${++index}** \`-\` __${video2.title}__`).join('\n')}`);
        } catch (err) {
          return message.send('❌ `|` 🎵 **Invalid selection.** Cancelling search.');
        }
        const videoIndex = +response;
        video = await youtube.getVideoByID(videos[videoIndex - 1].id);
      } catch (err) {
        return message.send(`❌ \`|\` 🎵 \`${searchString}\` **did not match any results.**`);
      }
    }

    handleVideo(video, message, voiceChannel, false);

  }

  async function handleVideo(video, msg, voiceChannel, playlist = false) {
    const serverQueue = client.musicQueue.get(msg.guild.id);
    const duration = parse(`${video.duration.hours} hours, ${video.duration.minutes} minutes, ${video.duration.seconds} seconds`);
    const song = {
      id: video.id,
      title: Util.escapeMarkdown(video.title),
      url: `https://www.youtube.com/watch?v=${video.id}`,
      thumbnail: video.thumbnails.maxres.url ? video.thumbnails.maxres.url : 'http://www.stickpng.com/assets/images/580b57fcd9996e24bc43c545.png',
      duration: duration,
      videoObject: video
    };
    if (!serverQueue) {
      const queueConstruct = {
        textChannel: msg.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 10,
        playing: {
          isPlaying: true,
          duration: 0
        },
        loop: false
      };
      queueConstruct.queue = queueConstruct.songs; // Alias queue -> songs (because i've already made that mistake)
      client.musicQueue.set(msg.guild.id, queueConstruct);

      queueConstruct.songs.push(song);

      try {
        const connection = await voiceChannel.join();
        queueConstruct.connection = connection;
        play(msg.guild, queueConstruct.songs[0]);
      } catch (error) {
        client.musicQueue.delete(msg.guild.id);
        return msg.send(`❌ \`|\` **Error while joining:** \`${error}\``);
      }
    } else {
      serverQueue.songs.push(song);
      if (playlist) return;
      else return msg.send(`✅ \`|\` \`${song.title}\` **has been added to the queue.**`);
    }
    return;
  }

  async function play(guild, song) {
    const serverQueue = client.musicQueue.get(guild.id);

    if (!song) {
      message.send(':musical_note: **Queue is empty! Leaving...**');
      serverQueue.voiceChannel.leave();
      client.musicQueue.delete(guild.id);
      clearInterval(serverQueue.playing.interval);
      serverQueue.playing.duration = 0;
      return;
    }

    const toPlay = await ytdl(song.url, { filter: 'audioonly', highWaterMark: Infinity, quality: 'highestaudio' });

    serverQueue.connection.playStream(toPlay)
      .on('end', async reason => {
        if (reason !== 'Stream is not generating quickly enough.') message.send(reason);
        if(serverQueue.loop) {
          const songAt0 = serverQueue.songs.shift();
          serverQueue.songs.push(songAt0);
        }
        else serverQueue.songs.shift();
        serverQueue.playing.duration = 0;
        await play(guild, serverQueue.songs[0]);
      })
      .on('error', error => {client.logger.error(error); return message.send(`:x: \`|\` 🎵 **There was an error:** \`${error}\``);});

    if(serverQueue.playing.interval) clearInterval(serverQueue.playing.interval);
    serverQueue.playing.interval = setInterval(() => serverQueue.playing.duration++, 1000);
    serverQueue.textChannel.send(`🎵 **Started playing** \`${song.title}\``);

  }
};

exports.conf = {
  enabled: true,
  aliases: ['music'],
  guildOnly: true,
  permLevel: 'User'
};

exports.help = {
  name: 'play',
  description: 'Play a song',
  usage: 'play <youtube url>',
  category: 'Music'
};