exports.run = async (client, message, args) => {
  if(!['shutdown', 'restart', 'reboot'].includes(args[0])) return message.send('❌ | :arrows_counterclockwise: **Options:** shutdown restart / reboot');

  if(args[0] === 'shutdown') {
    message.send('✅ | :stop_sign: **Shutting down...**');
    require('child_process').exec('pm2 stop LWBot');
    process.exit();
  }

  if(args[0] === 'restart' || args[0] === 'reboot') {
    if(!process.env._pm2_version) {
      await message.send('❌ `|` :arrows_counterclockwise: **Process is not running under pm2.** Simply exiting...');
      client.destroy();
      process.exit(0);
    } else {
      message.send(`✅ \`|\` :arrows_counterclockwise: **${args[0].toProperCase()}ing...**`);
      require('child_process').exec('pm2 restart LWBot');
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
