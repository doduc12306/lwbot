exports.run = async (client, message, args) => {// eslint-disable-line no-unused-vars
  if(args[0] === "web") {
    require('child_process').exec('pm2 restart web');
    return message.channel.send(`:gear: **Restarting. Should be available soon.**`);
  }

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
  description: `Restarts the bot/website.`,
  usage: `reboot`
};
