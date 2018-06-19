const fs = require(`fs`);

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const cmdFiles = await fs.readdir(`./commands/`);
  if (!args) {
    message.channel.send(`:x: You didn't give me a command to reload!`);
  } else {
    let response = await client.unloadCommand(args[0]);
    if (response) return message.reply(`Error Unloading: ${response}`);

    response = client.loadCommand(args[0]);
    if (response) return message.reply(`Error Loading: ${response}`);

    message.reply(`The command \`${args[0]}\` has been reloaded`);}
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: `Bot Admin`
};

exports.help = {
  name: `reload`,
  category: `System`,
  description: `Reloads a command that's been modified.`,
  usage: `reload [command]`
};
