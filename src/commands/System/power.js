exports.run = async (client, message, args) => {
  if(!['shutdown', 'restart', 'reboot'].includes(args[0])) return message.send('❌ | 🔄 **Options:** `shutdown`, `restart` / `reboot`');

  if(args[0] === 'shutdown') {
    if (!process.env.pm_uptime) {
      await message.send('❌ `|` 🛑 **Process is not running under pm2.** Simply exiting...');
      client.destroy();
      process.exit(0);
    } else {
      message.send(`✅ \`|\` 🛑 **${args[0].toProperCase()}ing...**`);
      require('child_process').exec('pm2 stop LWBot');
    }
  }

  if(args[0] === 'restart' || args[0] === 'reboot') {
    if(!process.env.pm_uptime) {
      await message.send('❌ `|` 🔄 **Process is not running under pm2.** Simply exiting...');
      client.destroy();
      process.exit(0);
    } else {
      message.send(`✅ \`|\` 🔄 **${args[0].toProperCase()}ing...**`);
      client.destroy();
      process.exit(0); // pm2 will automatically restart this process
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'Bot Admin'
};

exports.help = {
  name: 'power',
  category: 'System',
  description: 'Restart, shut down',
  usage: 'power <shutdown/[restart/reboot]>'
};
