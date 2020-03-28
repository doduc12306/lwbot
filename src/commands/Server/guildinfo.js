const Discord = require('discord.js');
const moment = require('moment');
const { prettyFeatures, prettyPremiumTiers } = require('../../util/prettyFlags');

module.exports.run = (client, message) => {
  let guildIcon;
  // If the guild icon is empty, sets guildIcon to owner's avatar
  if (message.guild.iconURL()) { guildIcon = message.guild.iconURL(); }
  else { guildIcon = message.guild.owner.user.displayAvatarURL({ format: 'png', dynamic: true }); }

  let emotes;
  // Goes with the emote parsing
  const emoteInfo = message.guild.emojis.cache.map(e => e.toString()).join(' ');
  // Checks to see if the total character count of all the emojis combined is ≥ 1024
  if (emoteInfo.length >= 1024) {
    emotes = `${message.guild.emojis.cache.size} emotes`;
    // Checks to see if there are no emotes
  } else if (emoteInfo.length === 0) {
    emotes = 'None';
    // Sets emotes to all of the emojis, and they get printed in the embed field
  } else {
    emotes = message.guild.emojis.cache.map(e => e.toString()).join(' ');
  }

  const guildCreatedAt = moment(message.guild.createdAt).format('MMM Do YYYY, h:mm a');

  // Pretty-ifies the region
  let region;
  switch (message.guild.region) {
    case 'us-east': { region = '<:regionFlagUSA:393889521449566208> Eastern USA'; break; }
    case 'brazil': { region = '<:regionFlagBrazil:393889521177198602> Brazil'; break; }
    case 'eu-central': { region = '<:regionFlagEurope:393889521155964929> Central Europe'; break; }
    case 'hongkong': { region = '<:regionFlagHongKong:393889521134993409> Hong Kong'; break; }
    case 'japan': { region = '<:regionFlagJapan:393889521487577109> Japan'; break; }
    case 'russia': { region = '<:regionFlagRussia:393889521009295371> Russia'; break; }
    case 'singapore': { region = '<:regionFlagSingapore:393889521608949781> Singapore'; break; }
    case 'sydney': { region = '<:regionFlagSydney:393889521374068746> Sydney'; break; }
    case 'us-central': { region = '<:regionFlagUSA:393889521449566208> Central USA'; break; }
    case 'us-south': { region = '<:regionFlagUSA:393889521449566208> Southern USA'; break; }
    case 'us-west': { region = '<:regionFlagUSA:393889521449566208> Western USA'; break; }
    case 'eu-west': { region = '<:regionFlagEurope:393889521155964929> Western Europe'; break; }
    default: { region = `<:regionFlagWumpus:393900238244675606> ${message.guild.fetchVoiceRegions().then(g => g.find(h => h.id === message.guild.region).name)}`; break; }
  }

  // Verification level checker
  let verification;
  if (message.guild.verificationLevel === 'NONE') { verification = 'None'; }
  else if (message.guild.verificationLevel === 'LOW') { verification = 'Low'; }
  else if (message.guild.verificationLevel === 'MEDIUM') { verification = 'Medium'; }
  else if (message.guild.verificationLevel === 'HIGH') { verification = '(╯°□°）╯︵ ┻━┻ (High: 10 minutes on server)'; }
  else if (message.guild.verificationLevel === 'VERY_HIGH') { verification = '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻ (Very High: Verified phone)'; }

  // Embed color
  let color = message.guild.me.displayColor;
  if (message.guild.me.displayColor === 0) color = '0x59D851';

  const embed = new Discord.MessageEmbed()
    .setColor(color)
    .setThumbnail(guildIcon)
    .setAuthor(message.guild.name, guildIcon, null)
    .addField('Guild Owner', message.guild.owner.user.tag, true)
    .addField('Guild ID', message.guild.id, true)
    .addField('Members', message.guild.memberCount, true)
    .addField('Channels', `${message.guild.channels.cache.size} channels`, true)
    .addField('Region', region, true)
    .addField('Verification', verification, true)
    .addField('Server Created', guildCreatedAt, true)
    .addField('Emotes', emotes, true);

  if(message.guild.description) embed.setDescription(message.guild.description);
  if(message.guild.premiumSubscriptionCount !== 0) embed.addField('Nitro Boost', `${message.guild.premiumSubscriptionCount} Boosters - ${prettyPremiumTiers[message.guild.premiumTier]}`, true);
  if(message.guild.features.length !== 0) embed.addField('Features', message.guild.features.map(f => prettyFeatures[f]).join(', '), true);

  // The actual message
  message.send(embed);
};

exports.conf = {
  enabled: true,
  aliases: ['serverinfo', 'server', 'guild'],
  permLevel: 'User',
  guildOnly: true,
  requiresEmbed: true
};

exports.help = {
  name: 'guildinfo',
  description: 'Shows information about the server',
  usage: 'guildinfo',
  category: 'Server'
};
