exports.run = async (client, message) => {// eslint-disable-line no-unused-vars
  await message.reply(`:gear: **Restarting...**`);
  client.commands.forEach( async cmd => {
    await client.unloadCommand(cmd);
  });
  process.exit();
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [`restart`],
  permLevel: `Bot Admin`
};

exports.help = {
  name: `reboot`,
  category: `System`,
  description: `Shuts down the bot. If running under PM2, bot will restart automatically.`,
  usage: `reboot`
};
