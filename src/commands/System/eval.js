/* eslint-disable no-unused-vars */
const { inspect } = require('util');
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const moment = require('moment');
const parse = require('parse-duration');
const YouTube = require('simple-youtube-api');
//const youtube = new YouTube(process.env.GOOGLE_API_KEY);
//const ytdl = require('ytdl-core-discord');
require('moment-duration-format');

const commands = require('../../dbFunctions/message/commands');
const xp = require('../../dbFunctions/message/xp');
const GuildSettings = require('../../dbFunctions/message/settings');
const GuildEvents = require('../../dbFunctions/message/events');
const User = require('../../dbFunctions/client/user');
const sqWatchdog = require('../../util/sqWatchdog');
const package = require('../../../package.json');
const Tags = require('../../dbFunctions/client/tags');
const commandStats = require('../../dbFunctions/client/commandstats');
const SAR = require('../../dbFunctions/message/sar');
const GuildWordFilter = require('../../dbFunctions/message/wordFilter');

exports.run = async (client, message, args) => {
  require('../../dbFunctions/client/misc')(client);
  require('../../dbFunctions/client/protos')(client);
  require('../../dbFunctions/message/modbase')(client, message);

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
      message.send(output, { code: 'js' })
        .catch(e => {
          message.send('❌ **Error sending output, check the console.**');
          client.logger.error('Eval output error:' + e);
          client.logger.log('Initial eval output:' + output);
        });
    } else {
      message.send('❌ **Output was too long. Check the console.**');
      client.logger.log(output);
    }
  } catch (error) {
    try {
      message.send(`❌ **Error**\n\`\`\`xl\n${error}\n\`\`\` `).catch(errorSendingError => {
        message.send('❌ **Ironically, there was an error sending the error. Check the console.**');
        client.logger.error('Error sending eval error: ' + errorSendingError);
        client.logger.error('Initial eval error output: ' + error);
      });
    } catch (errorSendingError) {
      message.send('❌ **Ironically, there was an error sending the error. Check the console.**');
      client.logger.error('Error sending eval error: ' + errorSendingError);
      client.logger.error('Initial eval error ouput: ' + error);
    }
  }
};

function clean(text) {
  return text
    .replace(/`/g, '`' + String.fromCharCode(8203))
    .replace(/@/g, '@' + String.fromCharCode(8203));
}

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
