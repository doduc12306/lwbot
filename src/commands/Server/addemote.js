module.exports.run = (client, message, args) => {
  if (message.member.hasPermission('MANAGE_EMOJIS')) {
    const emojiName = args[0];
    const emojiURL = args[1];

    if (!emojiName) return message.send('❌ You forgot the emoji name!');
    if (!emojiURL) return message.send('❌ You forgot the emoji url!');

    message.guild.createEmoji(emojiURL, emojiName, null, `${message.author.tag} created emoji ${emojiName}`)
      .then(emote => message.send(`✅ Emote **\`${emote.name}\`** ${emote} created!`))
      .catch(err => message.send(`❌ Something went wrong:\n${err}`));

  } else message.send('❌ Missing Permission: `Manage Emojis`');
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['ae', 'addemoji', 'createemote', 'createemoji'],
  permLevel: 'Moderator'
};

exports.help = {
  name: 'addemote',
  description: 'Adds an emote to the server',
  category: 'Server',
  usage: 'addemote <name> <image url>'
};