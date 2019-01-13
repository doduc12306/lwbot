/* eslint-disable*/
const Discord = require('discord.js');
const Sequelize = require('sequelize');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const client = new Discord.Client();
client.login(process.env.TOKEN);

const db = new Sequelize('database', 'username', 'password', {
  logging: false,
  storage: '../src/databases/emojiLog.sqlite',
  dialect: 'sqlite',
  host: 'localhost'
});
var emojiDb = db.define('emojiUsage', {
  emoji: {
    type: Sequelize.STRING,
    allowNull: false
  },
  count: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {timestamps: false});
emojiDb.sync();

client.on('ready', () => console.log('Emoji logger ready!'));

client.on('message', async message => {
  if(message.author.bot || !['381192127050153993', '332632603737849856'].includes(message.guild.id)) return;

  if(message.content.match(/<:[A-z1-9]+:\d+>/gi)) {
    for (let emoji of message.content.match(/<:[A-z1-9]+:\d+>/gi)) {
      if(!client.guilds.get('381192127050153993').emojis.has(emoji.substring(emoji.indexOf(':', 2) + 1, emoji.length - 1))) return;
      emojiDb.findOne({where: {emoji: emoji}}).then(async data => {
        if(data === null) await emojiDb.create({emoji: emoji, count: 1});
        else emojiDb.update({count: data.dataValues.count + 1}, {where: {emoji: emoji}})
      });
    }
  }

  if(message.content === '~we info'){
    emojiDb.findAll({order: [['count', 'DESC']]}).then(data => {
      var desc = '';
      for(let emoji of data) {
        desc += `${emoji.dataValues.emoji}: Used **${emoji.dataValues.count}** times\n`;
      }
      const embed = new Discord.RichEmbed()
      .setTitle('Emoji Usage Info')
      .setDescription(desc)
      .setColor('0x59D851');
      message.channel.send(embed);
    });
  }
});