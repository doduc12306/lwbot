const Discord = require('discord.js');
var moment = require('moment');

module.exports.run = (client, message, args) => { // eslint-disable-line no-unused-vars
  if (message.channel.type === 'dm') {
    message.channel.send(':x: This command will not work in DM\'s');
    return;
  } else {

    var guildIcon;
    //If the guild icon is empty, sets guildIcon to owner's avatar
    if (message.guild.iconURL) {guildIcon = message.guild.iconURL;}
    else {guildIcon = message.guild.owner.user.avatarURL;}

    var emotes;
    //Goes with the emote parsing
    var emoteInfo = message.guild.emojis.map(e=>e.toString()).join(' ');
    //Checks to see if the total character count of all the emojis combined is ≥ 1024
    if (emoteInfo.length >= 1024) {
      emotes = `${message.guild.emojis.size} emotes`;
      //Checks to see if there are no emotes
    } else if (emoteInfo.length === 0) {
      emotes = 'None';
      //Sets emotes to all of the emojis, and they get printed in the embed field
    } else {
      emotes = message.guild.emojis.map(e=>e.toString()).join(' ');
    }

    //You can probably tell what this is by looking at the var name
    var guildCreatedAt = moment(message.guild.createdAt).format('MMM Do YYYY, h:mm a');

    //Pretty-ifies the region
    var region;
    if (message.guild.region === 'us-east') {region = '<:regionFlagUSA:393889521449566208> Eastern USA';}
    else if (message.guild.region === 'brazil') {region = '<:regionFlagBrazil:393889521177198602> Brazil';}
    else if (message.guild.region === 'eu-central') {region = '<:regionFlagEurope:393889521155964929> Central Europe';}
    else if (message.guild.region === 'hongkong') {region = '<:regionFlagHongKong:393889521134993409> Hong Kong';}
    else if (message.guild.region === 'japan') {region = '<:regionFlagJapan:393889521487577109> Japan';}
    else if (message.guild.region === 'russia') {region = '<:regionFlagRussia:393889521009295371> Russia';}
    else if (message.guild.region === 'singapore') {region = '<:regionFlagSingapore:393889521608949781> Singapore';}
    else if (message.guild.region === 'sydney') {region = '<:regionFlagSydney:393889521374068746> Sydney';}
    else if (message.guild.region === 'us-central') {region = '<:regionFlagUSA:393889521449566208> Central USA';}
    else if (message.guild.region === 'us-south') {region = '<:regionFlagUSA:393889521449566208> Southern USA';}
    else if (message.guild.region === 'us-west') {region = '<:regionFlagUSA:393889521449566208> Western USA';}
    else if (message.guild.region === 'eu-west') {region = '<:regionFlagEurope:393889521155964929> Western Europe';}
    else {region = '<:regionFlagWumpus:393900238244675606> Wumpus Land (Unknown / Error)';}

    //Verification level checker
    var verification;

    if (message.guild.verificationLevel === 0) {verification = 'None';}
    else if (message.guild.verificationLevel === 1) {verification = 'Low';}
    else if (message.guild.verificationLevel === 2) {verification = 'Medium';}
    else if (message.guild.verificationLevel === 3) {verification = '(╯°□°）╯︵ ┻━┻ (High: 10 minutes on server)';}
    else if (message.guild.verificationLevel === 4) {verification = '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻ (Extreme: Verified phone)';}

    // embed color
    var color = message.guild.me.displayColor;
    if(message.guild.me.displayColor === 0) color = '0x59D851';

    //The actual message
    message.channel.send(new Discord.RichEmbed()
      .setColor(color)
      .setThumbnail(guildIcon)
      .setAuthor(`Information on ${message.guild.name}:`, guildIcon, null)
      .addField('Guild Owner:', message.guild.owner.user.tag, true)
      .addField('Guild ID:', message.guild.id, true)
      .addField('Members:', message.guild.memberCount, true)
      .addField('Channels:', `${message.guild.channels.size} channels`, true)
      .addField('Region:', region, true)
      .addField('Verification:', verification, true)
      .addField('Server Created:', guildCreatedAt, true)
      .addField('Emotes:', emotes, true)
    );
  }
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
