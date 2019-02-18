exports.run = async (client, message) => {
  const level = client.permlevel(message.member);
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
  category: 'System',
  description: 'Tells you your permission level for the current message location.',
  usage: 'permlevel'
};