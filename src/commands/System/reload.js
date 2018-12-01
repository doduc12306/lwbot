exports.run = async (client, message, args) => {
  if (!args[0]) return message.channel.send(':x: You didn\'t give me a command to reload!');
  if (args[0] === 'file') {
    try {
      delete require.cache[require.resolve(args[1])];
      message.channel.send(`:white_check_mark: **Reloaded** \`${args[1]}\``);
      client.logger.log('Reloaded'+args[1]);
    } catch (err) {
      return message.channel.send(`:x: \`${err}\``);
    }
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
  usage: 'reload <command>'
};
