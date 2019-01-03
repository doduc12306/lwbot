exports.run = async (client, message, args) => {
  if (!args[0]) return message.send(':x: You didn\'t give me a command to reload!');
  if (args[0] === 'file') {
    try {
      let toReload = args[1];
      if(!toReload.includes('../../')) toReload = `../../${args[1]}`;
      delete require.cache[require.resolve(toReload)];
      message.send(`:white_check_mark: **Reloaded** \`${toReload}\``);
      client.logger.log('Reloaded '+toReload);
    } catch (err) {
      return message.send(`:x: \`${err}\``);
    }
  } else {
    let response = await client.unloadCommand(args[0]);
    if (response) return message.send(`:x: **Error Unloading:** ${response}`);

    response = client.loadCommand(client.folder.get(args[0]), args[0]);
    if (response) return message.send(`:x: **Error Loading:** \`${response}\``);

    message.send(`:white_check_mark: **Reloaded** \`${args[0]}\``);
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
