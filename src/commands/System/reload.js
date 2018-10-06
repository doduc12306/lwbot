const fs = require('fs');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  await fs.readdir('./commands/');
  if (!args[0]) {
    message.channel.send(':x: You didn\'t give me a command to reload!');
  } else {
    let response = await client.unloadCommand(args[0]);
    if (response) return message.channel.send(`:x: **Error Unloading:** ${response}`);

    response = client.loadCommand(client.folder.get(args[0]), args[0]);
    if (response) return message.channel.send(`:x: **Error Loading:** \`${response}\``);

    message.channel.send(`:white_check_mark: **Reloaded** \`${args[0]}\``);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'Bot Admin'
};

exports.help = {
  name: 'reload',
  category: 'System',
  description: 'Reloads a command that\'s been modified.',
  usage: 'reload [command]'
};
