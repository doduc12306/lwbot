const Discord = require('discord.js');
const client = new Discord.Client();
const Sequelize = require('sequelize');

var { join } = require('path');
require('dotenv').config({ path: join(__dirname, '../.env') });

var killList = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: '../src/databases/killList.sqlite'
});
killList = killList.define('killList', {
  user: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
killList.sync();

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

  if(message.content === `${prefix}dead`) {
    var deadList = [];
    killList.findAll().then(async dead => {
      for(var users of dead) deadList.push(client.users.get(users.dataValues.user));
      message.channel.send(new Discord.RichEmbed()
        .setColor(require('../src/config').colors.red)
        .setDescription(deadList.join(' '))
      );
    });
  }

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
});

client.on('guildMemberAdd', member => {
  if (!['381192127050153993', '444250305618509824'].includes(member.guild.id)) return;

  if(member.displayName.match(/.gg/gm)) member.guild.ban(member.user, {reason: '[Auto Ban] Detected .gg in username'});
});