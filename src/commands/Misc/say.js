module.exports.run = (client, message, args) => {
  if (!args[0]) return message.send(':x: `|` 🗣️ **You didn\'t give me something to say!**');
  let say = args.slice(0).join(' ');

  let channel = message.channel;
  try { channel = message.functions.parseChannel(args[0]); say = args.slice(1).join(' '); } catch (e) { /* Silently fail. Doesn't matter */ }

  if(message.guild.settings['deleteCommand'] !== 'true') message.delete();
  channel.send(say);
};

exports.conf = {
  enabled: true,
  aliases: ['repeat', 'write'],
  guildOnly: false,
  permLevel: 'Moderator'
};

exports.help = {
  name: 'say',
  description: 'Make the bot say something',
  usage: 'say [channel] <message>',
  category: 'Misc'
};