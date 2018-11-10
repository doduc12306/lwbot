const Discord = require('discord.js');
const client = new Discord.Client();

var { join } = require('path');
require('dotenv').config({ path: join(__dirname, '../.env') });

const prefix = '~wa ';

if (process.argv.includes('-d') || process.argv.includes('--debug')) client.login(process.env.DEBUG_TOKEN);
else client.login(process.env.TOKEN);

client.on('ready', () => console.log(`Wtc addon ready: ${client.user.tag}`));

client.on('message', async message => {
  if (message.author.bot || message.author === client.user) return;
  if (!message.content.startsWith(prefix)) return;
  if (!['381192127050153993', '444250305618509824', '332632603737849856'].includes(message.guild.id)) return message.channel.send(':x: `|` **This guild is not authorized to use any of these commands!**');

  const args = message.content.slice(prefix.length).trim().split(/ +/g);

  if(message.content === `${prefix}ping`) return message.channel.send(`:ping_pong: ${Math.round(client.ping)}ms`);

  // Partnerships
  if(message.content.startsWith(`${prefix}partner`)) {
    var content = args.join(' ').split(' | ');
    var title = content[0].substring(7);
    var description = content[1];
    var invite = content[2];

    var cmdargs = content[3];

    if(!title) return message.channel.send(':x: **No title was given to this partnership!**');
    if(!description) return message.channel.send(':x: **No descripiton was given to this partnership!**');
    if(!invite) return message.channel.send(':x: **No invite was given to this partnership!**');

    var embed = new Discord.RichEmbed()
      .setTitle(title)
      .setDescription(description)
      .addField('Invite', invite);

    if(cmdargs) {
      if(cmdargs.includes('color=')) {
        var color = cmdargs.match(/color=(\S+)/gi)[0].substring(6);
        if(color.startsWith('#')) color = color.split('#')[1];
        embed.setColor(color);
      }

      if(cmdargs.includes('img=')) {
        var img = cmdargs.match(/img=(\S+)/gi)[0].substring(4);
        embed.setImage(img);
      }

    } else {
      embed.setColor(require('../src/config').colors.green);
    }

    message.channel.send(embed);
  }

  if(message.content.startsWith(`${prefix}pingrole`)) {
    if (!message.member.roles.some(r => ['436632593480548393', '381207509685370880', '469993430127476757', '447140023918395402'].includes(r.id))) return message.channel.send(':x: `|` **You do not have permission to use this command!**');
    if (!message.guild.me.permissions.has('MANAGE_ROLES')) return message.channel.send(':x: `|` **Missing permission:** `Manage Roles`');

    var content = args.join(' ').split(' | '); // eslint-disable-line

    var role = content[0].substring(8).trim();
    if(!role) return message.channel.send(':x: `|` **You didn\'t give the name of a role to ping!**');
    role = message.guild.roles.find(role => role.name === role);
    if(role === null) return message.channel.send(':x: `|` **I could not find that role!**');

    if(role.position >= message.guild.me.highestRole.position) return message.channel.send(`:x: \`|\` \`${role.name}\` **is too high for me!** (Move it below my role)`);

    var msg = content.slice(1).join(' ');

    await role.edit({mentionable: true});
    await message.channel.send(`${role.toString()} | ${msg}`);
    await role.edit({mentionable: false});
  }
});

client.on('guildMemberAdd', member => {
  if (!['381192127050153993', '444250305618509824'].includes(member.guild.id)) return;

  if(member.displayName.match(/.gg/gm)) member.guild.ban(member.user, {reason: '[Auto Ban] Detected .gg in username'});
});