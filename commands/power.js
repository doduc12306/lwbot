exports.run = async (client, message, args) => {// eslint-disable-line no-unused-vars
  if(!['shutdown', 'restart', 'reboot'].includes(args[0])) return message.channel.send(':x: | :arrows_counterclockwise: **Options:** shutdown restart / reboot');

  if(args[0] === 'shutdown') {
    message.channel.send(':white_check_mark: | :stop_sign: **Shutting down...**');
    require('child_process').exec('pm2 stop LWBot');
  }

  if(args[0] === 'restart' || args[0] === 'reboot') {
    message.channel.send(`:white_check_mark: \`|\` :arrows_counterclockwise: **${args[0].toProperCase()}ing...**`);
    require('child_process').exec('pm2 restart LWBot');
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
