/* eslint-disable no-unused-vars */
const { inspect } = require('util');
const snek = require('snekfetch');
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const moment = require('moment');
var parse = require('parse-duration');
require('moment-duration-format');

exports.run = async (client, message, args, level) => {
  const code = args.join(' ');
  const token = client.token.split('').join('[^]{0,2}');
  const rev = client.token.split('').reverse().join('[^]{0,2}');
  const filter = new RegExp(`${token}|${rev}`, 'g');
  try {
    let output = eval(code);
    if (output instanceof Promise || (Boolean(output) && typeof output.then === 'function' && typeof output.catch === 'function')) output = await output;
    output = inspect(output, { depth: 0, maxArrayLength: null });
    output = output.replace(filter, 'fucking idiot, why are you trying to show my token? go to the dev page, lazy ass');
    output = clean(output);
    if (output.length < 1950) {
      message.channel.send(`\`\`\`js\n${output}\n\`\`\``);
    } else {
      try {
        const { body } = await snek.post('https://www.hastebin.com/documents').send(output);
        message.channel.send(`:x: **Output too long, uploaded to hastebin:** \`https://www.hastebin.com/${body.key}.js\` `);
      } catch (error) {
        message.channel.send(`:x: **Hastebin upload error:** \`${error.name}\`\n\`\`\`\n${error.message}\n\`\`\``);
      }
    }
  } catch (error) {
    error = error.stack.split('\n'); // eslint-disable-line no-ex-assign
    if (error[1].trim() === 'at Object.exports.run (/Users/akii/Documents/bots/lwbot-rewrite/commands/eval.js:16:18)' || error[1].trim() === 'at Object.exports.run (/root/lwbot-rewrite/commands/eval.js:15:23)') return message.channel.send(`:x: **An error occurred:** \`${error[0]}\``);
    message.channel.send(`:x: **An error occurred:** \`${error[0]}\`\n\`\`\`\n${error[1].trim()}\n\`\`\``);
  }

  function clean(text)  {
    return text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203));
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'Bot Owner'
};

exports.help = {
  name: 'eval',
  category: 'System',
  description: 'Evaluates arbitrary javascript.',
  usage: 'eval <js code>'
};
