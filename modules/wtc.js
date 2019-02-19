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

client.on('guildMemberAdd', member => {
  if (!['381192127050153993', '444250305618509824'].includes(member.guild.id)) return;

  if(member.displayName.match(/.gg/gm)) member.guild.ban(member.user, {reason: '[Auto Ban] Detected .gg in username'});
});

client.on('raw', packet => {
  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;

  const genreChannel = client.channels.get('444375693728546816');
  const pingChannel = client.channels.get('440974386544115713');
  const miscChannel = client.channels.get('444375656139063296');

  const guild = client.guilds.get(packet.d.guild_id);
  const member = guild.members.get(packet.d.user_id);

  function toggleRole(role) {
    if (packet.t === 'MESSAGE_REACTION_ADD') member.addRole(role).then(() => console.log(`Added ${role} to ${member.displayName}`)).catch(e => console.error(e));
    if (packet.t === 'MESSAGE_REACTION_REMOVE') member.removeRole(role).then(() => console.log(`Removed ${role} from ${member.displayName}`)).catch(e => console.error(e));
  }

  if (packet.d.channel_id === genreChannel.id) {
    switch (packet.d.emoji.name) {
      case '⚔':
        toggleRole('444346550760636417');
        break;
      case '💪':
        toggleRole('444396478446829568');
        break;
      case '❤':
        toggleRole('444346546142838784');
        break;
      case '👻':
        toggleRole('444346749390159872');
        break;
      case '🏀':
        toggleRole('444346752976551936');
        break;
      case '📔':
        toggleRole('444346756159766536');
        break;
      case '🤣':
        toggleRole('444347123769802754');
        break;
      case '💥':
        toggleRole('527578436089413634');
        break;
    }
  }

  if (packet.d.channel_id === pingChannel.id) {
    switch (packet.d.emoji.name) {
      case '📌':
        toggleRole('432633011515949067');
        break;
      case '🍿':
        toggleRole('440974703062941696');
        break;
      case '🕹':
        toggleRole('440974647975215125');
        break;
      case '🎤':
        toggleRole('455182908551069697');
        break;
      case '😍':
        toggleRole('458434931899498518');
        break;
      case '✍':
        toggleRole('458436541694607361');
        break;
      case '🎨':
        toggleRole('458436569662226442');
        break;
      case '💜':
        toggleRole('442896867307683842');
        break;
      case '📝':
        toggleRole('453294003002015744');
        break;
      case '🤝':
        toggleRole('506247359316099082');
        break;
      case '🔍':
        toggleRole('541075954785845269');
        break;
    }
  }

  if (packet.d.channel_id === miscChannel.id) {
    switch (packet.d.emoji.name) {
      case '📩':
        toggleRole('444347837560520704');
        break;
      case '⛔️':
        toggleRole('444347835060846612');
        break;
      case '❓':
        toggleRole('444347831864524800');
        break;
      case '💻':
        toggleRole('444347838235672596');
        break;
      case '🎮':
        toggleRole('444347839091572736');
        break;
      case '💚':
        toggleRole('444348193568718849');
        break;
      case '✌️':
        toggleRole('444348188975955969');
        break;
      case '🎥':
        toggleRole('444348190771380226');
        break;
      case '👁':
        toggleRole('444390328158650388');
        break;
      case '🌈':
        toggleRole('455240513390641162');
        break;
      case '📓':
        toggleRole('444340936286273538');
        break;
      case '📘':
        toggleRole('444291891899662346');
        break;
      case '📕':
        toggleRole('444291781031493633');
        break;
      case '📗':
        toggleRole('444346408670330890');
        break;
      case '📙':
        toggleRole('444347691619844107');
        break;
    }
  }
});