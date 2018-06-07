const { promisify } = require(`util`);
const readdir = promisify(require(`fs`).readdir);

module.exports.run = async (client, message, args) => {
  
  await message.channel.send(`:gear: **Loading a total of ${cmdFiles.length} commands...**`);
    
  require(`./modules/functions.js`)(client);
  const cmdFiles = await readdir(`./commands/`);
    
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
  aliases: [`reloadCommands`, `reloadCmds`, `reloadAllCmds`],
  guildOnly: false,
  permLevel: `Bot Admin`
};

exports.help = {
  name: `reloadAll`,
  description: `Reloads all the commands in the /commands/ folder.`,
  category: `System`,
  usage: `reloadAll`
};