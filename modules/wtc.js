const Discord = require('discord.js');
const client = new Discord.Client();

const { join } = require('path');
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
    if (!message.member.roles.has('506236968393375745')) return message.channel.send(':x: `|` **You do not have permission to use this command!**');
    if (!message.guild.me.permissions.has('MANAGE_ROLES')) return message.channel.send(':x: `|` **Missing permission:** `Manage Roles`');

    const content = args.join(' ').split(' | ');
    const title = content[0].substring(7);
    const description = content[1];
    const invite = content[2];

    const cmdargs = content[3];

    if(!title) return message.channel.send(':x: **No title was given to this partnership!**');
    if(!description) return message.channel.send(':x: **No descripiton was given to this partnership!**');
    if(!invite) return message.channel.send(':x: **No invite was given to this partnership!**');

    const embed = new Discord.RichEmbed()
      .setTitle(title)
      .setDescription(description)
      .addField('Invite', invite);

    if(cmdargs) {
      if(cmdargs.includes('color=')) {
        let color = cmdargs.match(/color=(\S+)/gi)[0].substring(6);
        if(color.startsWith('#')) color = color.split('#')[1];
        embed.setColor(color);
      }

      if(cmdargs.includes('img=')) {
        const img = cmdargs.match(/img=(\S+)/gi)[0].substring(4);
        embed.setImage(img);
      }

    } else {
      embed.setColor(require('../src/config').colors.green);
    }

    const role = message.guild.roles.get('506247359316099082');

    await role.edit({ mentionable: true });
    await message.channel.send(role.toString(), {embed: embed});
    await role.edit({ mentionable: false });
  }

  if(message.content.startsWith(`${prefix}pingrole`)) {
    if (!message.member.roles.some(r => ['436632593480548393', '381207509685370880', '469993430127476757', '447140023918395402'].includes(r.id))) return message.channel.send(':x: `|` **You do not have permission to use this command!**');
    if (!message.guild.me.permissions.has('MANAGE_ROLES')) return message.channel.send(':x: `|` **Missing permission:** `Manage Roles`');

    const content = args.join(' ').split(' | ');

    let role = content[0].substring(8).trim();
    if(!role) return message.channel.send(':x: `|` **You didn\'t give the name of a role to ping!**');
    role = message.guild.roles.find(role => role.name === role);
    if(role === null) return message.channel.send(':x: `|` **I could not find that role!**');

    if(role.position >= message.guild.me.highestRole.position) return message.channel.send(`:x: \`|\` \`${role.name}\` **is too high for me!** (Move it below my role)`);

    const msg = content.slice(1).join(' ');

    await role.edit({mentionable: true});
    await message.channel.send(`${role.toString()} | ${msg}`);
    await role.edit({mentionable: false});
  }
});