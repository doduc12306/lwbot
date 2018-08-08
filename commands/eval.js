const { inspect } = require(`util`);
const { post } = require(`snekfetch`);
const Discord = require(`discord.js`);
const Sequelize = require(`sequelize`);
const moment = require(`moment`);
var parse = require(`parse-duration`);
require(`moment-duration-format`);

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const code = args.join(` `);
  const token = client.token.split(``).join(`[^]{0,2}`);
  const rev = client.token.split(``).reverse().join(`[^]{0,2}`);
  const filter = new RegExp(`${token}|${rev}`, `g`);
  try {
    let output = eval(code);
    if (output instanceof Promise || (Boolean(output) && typeof output.then === `function` && typeof output.catch === `function`)) output = await output;
    output = inspect(output, { depth: 0, maxArrayLength: null });
    output = output.replace(filter, `fucking idiot, why are you trying to show my token? go to the dev page, lazy ass`);
    output = clean(output);
    if (output.length < 1950) {
      message.channel.send(`\`\`\`js\n${output}\n\`\`\``);
    } else {
      try {
        const { body } = await post(`https://www.hastebin.com/documents`).send(output);
        message.channel.send(`Output was to long so it was uploaded to hastebin https://www.hastebin.com/${body.key}.js `);
      } catch (error) {
        message.channel.send(`I tried to upload the output to hastebin but encountered this error ${error.name}:${error.message}`);
      }
    }
  } catch (error) {
    error = `${error.stack}`;
    error = error.split('\n');
    message.channel.send(`:x: **An error occurred:** \`${error[0]}\`\n\`\`\`\n${error[1].trim()}\n\`\`\``);
  }

  function clean(text)  {
    return text
      .replace(/`/g, `\`` + String.fromCharCode(8203))
      .replace(/@/g, `@` + String.fromCharCode(8203));
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: `Bot Owner`
};

exports.help = {
  name: `eval`,
  category: `System`,
  description: `Evaluates arbitrary javascript.`,
  usage: `eval [...code]`
};
