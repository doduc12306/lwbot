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
  if(message.author.bot || message.author === client.user) return;
  if(!message.content.startsWith(prefix)) return;
  if (!['381192127050153993', '444250305618509824', '332632603737849856'].includes(message.guild.id)) return message.channel.send(':x: `|` **This guild is not authorized to use any of these commands!**');

  if(message.content === `${prefix}ping`) return message.channel.send(`:ping_pong: ${Math.round(client.ping)}ms`);

  if (message.content.startsWith(`${prefix}kill`)) {
    if (!['420220760066490379', '107599228900999168'].includes(message.author.id)) return message.channel.send(':x: `|` **Only chair / James can access this command!**');
    if (message.mentions.members.size === 0) return message.channel.send(':x: `|` **You didn\'t mention anyone to kill!**');

    message.mentions.members.forEach(async mention => {
      var role = '497871607692263425';
      if (!mention.roles.has(role)) return message.channel.send(`:x: \`|\` **${mention.user.tag} didn't have the Murder Mystery role. No action was taken.**`);
      await killList.findOrCreate({where: {user: mention.user.id}})
        .then(() => {
          mention.removeRole(role);
          message.channel.send(`:white_check_mark: \`|\` **Removed Murder Mystery from \`${mention.user.tag}\` and added to killed list.**`);
        })
        .catch(e => message.channel.send(`<@107599228900999168> :x: **Error adding user to kill db:** \`${e}\``));
      await setTimeout(() => { }, 1000);
    });
  }

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
});

client.on('guildMemberAdd', member => {
  if (!['381192127050153993', '444250305618509824'].includes(member.guild.id)) return;

  if(member.displayName.match(/.gg/gm)) member.guild.ban(member.user, {reason: '[Auto Ban] Detected .gg in username'});
});