const GuildSettings = require('../../dbFunctions/message/settings');
const UserClass = require('../../dbFunctions/client/user');
module.exports.run = (client, message, [action]) => {
  const settings = new GuildSettings(message.guild.id);
  const User = new UserClass(message.author.id);

  if (!action) {
    if (settings['owoMode']) { 
      settings.edit('owoMode', 'false'); 
      message.send('✅ **Disabled**'); 
    } else { 
      settings.edit('owoMode', 'true'); 
      message.send('✅ **Enabled**'); 
    }
  } else if (action === 'on') { 
    settings.edit('owoMode', 'true'); 
    message.send('✅ **Enabled**'); 
  } else if (action === 'off') { 
    settings.edit('owoMode', 'false');
    message.send('✅ **Disabled**'); 
  } else if (action === 'toggle') {
    if (settings['owoMode']) { 
      settings.edit('owoMode', 'false'); 
      message.send('✅ **Disabled**'); 
    } else { 
      settings.edit('owoMode', 'true'); 
      message.send('✅ **Enabled**'); 
    }
  } else { message.send(':x: `owomode [on/off/toggle]`'); }

  User.changeBadges('add', '<:owo:626878656631013396>');
};

exports.conf = {
  enabled: true,
  aliases: [],
  guildOnly: true,
  permLevel: 'Moderator',
  hidden: true
};

exports.help = {
  name: 'owomode',
  description: 'Enable/disable owo mode',
  usage: 'owomode [on/off/toggle]',
  category: 'Server'
};