/* eslint-disable */
const google = require('google-it');
module.exports.run = async (client, message, args) => {
  const query = args.join(' ');

  if (!query) return message.send('❌ `|` :mag_right: **You didn\'t search for anything!**');

  const msg = await message.send('<a:loading:536942274643361794> `|` :mag_right: **Loading...**');

  google({ 'disableConsole': true, 'query': query })
    .then(res => {
      const result = res[0];
      msg.edit(`:mag_right: \`${result.title}\` - ${result.link}`);
    }).catch(e => {
      msg.edit(`❌ \`|\` :mag_right: **An error occurred.**\n\`\`\`${e}\`\`\``);
      client.logger.error(e.stack);
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User'
};

exports.help = {
  name: 'google',
  description: 'Google something',
  usage: 'google <query>',
  category: 'Misc'
};
