const { runner } = require('../../util/sqWatchdog');

module.exports.run = async (client, message, args) => {
  let adminMode = false;
  if (client.permlevel(message.member) >= 8) { message.send('⚡ ***ADMIN MODE*** ⚡'); adminMode = true; }

  const reply = await client.awaitReply(message, ':warning: `|` 🔄 **Are you ABSOLUTELY SURE you want to reset ALL settings & XP?** This **CANNOT** be undone! (`y/es` or `n/o`)');
  if(/y(es)?/gi.test(reply)) {
    let guild = message.guild;
    if(adminMode && args[0]) {
      const possibleGuild = client.guilds.get(args[0]);
      if(!possibleGuild) return message.send(`:x: \`|\` 🔄 **Guild not found:** \`${args[0]}\``);
      else guild = possibleGuild;
    }

    message.send('<a:loading:536942274643361794> `|` 🔄 **Reset in progress!** `0 / 3`').then(async msg => {
      const resetSuccess = await runner(client, guild.id, true);
      if(!resetSuccess) return msg.edit(`:x: \`|\` 🔄 **Reset failed at DB reset.** ${resetSuccess}`);
      else msg.edit('<a:loading:536942274643361794> `|` 🔄 **Reset in progress!** `1 / 3`');

      const syncSuccess = await runner(client, guild.id, false);
      if(!syncSuccess) return msg.edit(`:x: \`|\` 🔄 **Reset failed at DB sync.** ${syncSuccess}`);
      else msg.edit('<a:loading:536942274643361794> `|` 🔄 **Reset in progress!** `2 / 3`');

      const emitSuccess = await client.emit('guildCreate', guild);
      if(!emitSuccess) return msg.edit(`:x: \`|\` 🔄 **Reset failed at guild emit.** ${emitSuccess}`);
      else msg.edit('<a:loading:536942274643361794> `|` 🔄 **Reset in progress!** `3 / 3`');

      await client.wait(500);

      msg.edit('✅ `|` 🔄 **Reset completed.**');
    });
    
  }
  else if(/n(o)?/gi.test(reply)) return message.send('ℹ️ `|` 🔄 **Command cancelled.**');
  else return message.send(':x: `|` 🔄 **Reply not recognized.** Please respond with `y/es` or `n/o`.');
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['resetserver', 'resetguild', 'resetall'],
  permLevel: 'Bot Commander'
};

exports.help = {
  name: 'reset',
  description: 'Resets the server back to default settings/XP',
  usage: 'reset',
  category: 'Server'
};