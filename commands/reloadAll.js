const { promisify } = require(`util`);
const readdir = promisify(require(`fs`).readdir);

module.exports.run = async (client, message, args) => {   
  require(`../modules/functions.js`)(client);
  const cmdFiles = await readdir(`./commands/`);

  await message.channel.send(`:gear: **Reloading a total of ${cmdFiles.length} commands...**`);
    
  // unloads all the commands
  await cmdFiles.forEach(f => {
    if (!f.endsWith(`.js`)) return;
    const response = client.unloadCommand(f);
    if (response) console.log(response);
  });
    
  // loads all the commands
  await cmdFiles.forEach(f => {
    if (!f.endsWith(`.js`)) return;
    const response = client.loadCommand(f);
    if (response) console.log(response);
  });

  await message.channel.send(`:white_check_mark: **Done!** Loaded ${cmdFiles.length} commands.`);

};

exports.conf = {
  enabled: true,
  aliases: [`reloadcommands`, `reloadcmds`, `reloadallcmds`],
  guildOnly: false,
  permLevel: `Bot Admin`
};

exports.help = {
  name: `reloadall`,
  description: `Reloads all the commands in the /commands/ folder.`,
  category: `System`,
  usage: `reloadall`
};