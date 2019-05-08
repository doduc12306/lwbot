/* eslint-disable no-unused-vars */
const { inspect } = require('util');
const { post } = require('snekfetch');
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const moment = require('moment');
const parse = require('parse-duration');
const settings = require('../../modules/message/settings');
require('moment-duration-format');

exports.run = async (client, message, args) => {
  require('../../modules/client/bank')(client);
  require('../../modules/client/misc')(client);
  require('../../modules/client/protos')(client);
  require('../../modules/client/tags')(client);
  require('../../modules/message/misc')(client, message);
  require('../../modules/message/modbase')(client, message);
  const commands = require('../../modules/message/commands');
  const xp = require('../../modules/message/xp');
  const settings = require('../../modules/message/settings');

  const code = args.join(' ');
  const token = client.token.split('').join('[^]{0,2}');
  const rev = client.token.split('').reverse().join('[^]{0,2}');
  const filter = new RegExp(`${token}|${rev}`, 'g');
  try {
    let output = eval(code);
    if (output instanceof Promise || (Boolean(output) && typeof output.then === 'function' && typeof output.catch === 'function')) output = await output;
    output = inspect(output, { depth: 0, maxArrayLength: null });
    output = output.replace(filter, 'FILTERED TOKEN');
    output = clean(output);
    if (output.length < 1950) {
      message.send(output, { code: 'js' });
    } else {
      try {
        const { body } = await post('https://www.hastebin.com/documents').send(output);
        message.send(`❌ **Output too long, uploaded to hastebin:** https://www.hastebin.com/${body.key}.js `);
      } catch (error) {
        message.send(`❌ **Hastebin upload error:** \`${error.name}\`\n\`\`\`\n${error.message}\n\`\`\``);
      }
    }
  } catch (error) {
    error = error.stack.split('\n'); // eslint-disable-line no-ex-assign
    if (error[1].trim().includes('at Object.exports.run (/Users/akii/Documents/bots/lwbot-rewrite/src/commands/System/eval.js') || error[1].trim().includes('at Object.exports.run (/root/lwbot-rewrite/src/commands/System/eval.js')) return message.send(`:x: **An error occurred:** \`${error[0]}\``);
    message.send(`:x: **An error occurred:** \`${error[0]}\`\n\`\`\`\n${error[1].trim()}\n\`\`\``);
  }

  function clean(text) {
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
