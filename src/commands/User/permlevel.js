exports.run = async (client, message) => {
  const level = message.guild ? client.permlevel(message.member) : () => { return message.send('**You are in DMs.** Your permission level is assumed 0 - User'); };
  const friendly = client.config.permLevels.find(l => l.level === level).name;
  message.send(`Your permission level is: ${level} - ${friendly}`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'User'
};

exports.help = {
  name: 'permlevel',
  category: 'User',
  description: 'Tells you your permission level for the current message location.',
  usage: 'permlevel'
};