const commandStats = require('../../dbFunctions/client/commandstats');
module.exports.run = async (client, message, args) => {
  if (!args[0]) {
    let data = await commandStats.statsTable.findAll();
    data = data.sort((a, b) => a.timesUsed > b.timesUsed ? -1 : 1); // Sort the data by times used, highest to lowest
    data = data.map(g => `**${g.command}**, used \`${g.timesUsed}\` times\n`);

    let msg = `📜 **Global command usage data:**\n\n${data.join('')}`;

    let optedOut = await commandStats.optOutUsers.findOne({ where: { userID: message.author.id } });
    optedOut = optedOut ? true : false;

    if (optedOut) msg += `\nℹ️ **You are currently opted out of this data.** To opt in, run \`${message.guild.settings['prefix']}commandstats opt-in\``;
    else msg += `\nℹ️ **You are currently included in this data.** To opt out of future data, run \`${message.guild.settings['prefix']}commandstats opt-out\`\n*This data is completely anonymous; it does not store any of your details.*`;

    message.send(msg, { split: true });
  } else if (/opt-?in/gi.test(args[0])) {

    commandStats.optOutUsers.destroy({ where: { userID: message.author.id } })
      .then(() => message.send('✅ `|` 📜 **Opted in for usage statistics.**'))
      .catch(e => {
        client.logger.verbose(`From ${__filename}`);
        client.logger.error(e);

        message.send(`:x: \`|\` 📜 **There was an error: \`${e}\``);
      });

  } else if (/opt-?out/gi.test(args[0])) {

    commandStats.optOutUsers.create({ userID: message.author.id })
      .then(() => message.send('✅ `|` 📜 **Opted out for usage statistics.**'))
      .catch(e => {
        client.logger.verbose(`From ${__filename}`);
        client.logger.error(e);

        message.send(`:x: \`|\` 📜 **There was an error: \`${e}\``);
      });

  } else {
    // Rerun the command, but with no args so the first bit shows up.
    this.run(client, message, args = []);
  }
};

exports.conf = {
  enabled: true,
  permLevel: 'User',
  guildOnly: false,
  aliases: ['cmdstats']
};

exports.help = {
  name: 'commandstats',
  description: 'Get some command usage statistics, or opt-out of stats',
  usage: 'commandstats [opt-out/opt-in]',
  category: 'System'
};