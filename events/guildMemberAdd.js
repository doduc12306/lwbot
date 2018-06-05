// This event executes when a new member joins a server. Let's welcome them! (or ban them!)
var Dbans = require(`dbans`);
const Discord = require(`discord.js`);

module.exports = (client, member) => {
  // Load the guild's settings
  const settings = client.settings.get(member.guild.id);

  // If welcome is off, don't proceed (don't welcome the user)
  if (settings.welcomeEnabled !== `true`) return;

  // Replace the placeholders in the welcome message with actual data
  const welcomeMessage = settings.welcomeMessage.replace(`{{user}}`, member.user.tag);

  // Send the welcome message to the welcome channel
  // There's a place for more configs here.
  member.guild.channels.find(`name`, settings.welcomeChannel).send(welcomeMessage).catch(console.error);

  Dbans = new Dbans(client.config.dbans_token);
  Dbans.check(member.user.id)
    .then(async user => {
      if (!user) return;

      var banEmbed = new Discord.RichEmbed()
        .setColor(`0xFF0000`)
        .setFooter(`Courtesy of bans.discordlist.net | Ban ID: ${user.banID}`)
        .setAuthor(member.user.tag, member.user.avatarURL)
        .setThumbnail(`https://cdn.discordapp.com/avatars/435539650149482526/1893e7033db3896e2f530b8023488fc3.png`)
        .setTitle(`\`:x: Banned from ${member.guild.name}\``)
        .addField(`Reason:`, user.reason)
        .addField(`Proof:`, user.proof);

      await user.send(banEmbed);
      await client.wait(1000);
      await member.guild.ban(member.user, {reason: `Auto ban: check the mod logs`});
      await client.wait(2000);
      await member.guild.channels.find(`name`, settings.modLogChannel).send(banEmbed);
    })
    .catch(err => client.users.get(client.config.ownerID).send(err));
};
