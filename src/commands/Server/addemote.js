module.exports.run = (client, message, args) => {
  if (!message.member.permissions.has('MANAGE_EMOJIS')) return message.send('❌ **You are missing a permission:** `Manage Emojis`');
  if(!message.guild.me.permissions.has('MANAGE_EMOJIS')) return message.send('❌ **I am missing a permission:** `Manage Emojis`');

  const emojiName = args[0];
  let emojiURL = args[1];

  if (!emojiName) return message.send('❌ You forgot the emoji name!');
  if (!args[1] && message.attachments.size === 0) return message.send('❌ You forgot the emoji url!');
  if (!args[1] && message.attachments.size > 0) emojiURL = message.attachments.first().url;

  // attachment, name
  message.guild.emojis.create(emojiURL, emojiName, { reason: `${message.author.tag} created emoji ${emojiName}` })
    .then(emote => message.send(`✅ **Emote \`${emote.name}\` ${emote} created!**`))
    .catch(err => {
      if (err.message.includes('File cannot be larger than 256.0 kb')) return message.send('❌ **Your image file size is too large!** Must not be larger than 256kb.');
      else if (err.message.includes('Maximum number of emojis reached (50)')) return message.send('❌ **Your server already has the maximum amount of emojis of this type!**');
      else {
        message.send(`❌ **Something went wrong:**\n${err}`);
        client.logger.error(err);
      }
    });
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
  usage: 'addemote <name> <image url / attachment>'
};