module.exports.run = (client, message, [ volume ]) => {
  const { voiceChannel } = message.member;
  if(!voiceChannel) return message.send('❌ `|` 🎵 **You aren\'t in a voice channel!**');

  const music = client.musicQueue.get(message.guild.id);
  if(!music) return message.send('❌ `|` 🎵 **There isn\'t anything playing!**');

  if(!volume) return message.send('❌ `|` **Missing a volume to change to!**');
  if (isNaN(volume)) return message.send(`❌ \`|\` \`${volume}\` **is not a number!**`);
  if(parseInt(volume) > 10 && message.author.id !== client.config.ownerID) return message.send('❌ `|` 🎵 **The volume must be 1 through 10!**');
  if(parseInt(volume) === music.volume) return message.send(`❌ \`|\` \`${volume}\` **is the volume right now!**`);

  music.connection.dispatcher.setVolumeLogarithmic(volume / 10);
  music.volume = volume;
  message.send(`✅ \`|\` 🎵 **Set volume to** \`${volume} / 10\``);
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: 'DJ',
  guildOnly: true
};

exports.help = {
  name: 'volume',
  description: 'Control the volume of the current track',
  usage: 'volume ≤ 10',
  category: 'Music'
};