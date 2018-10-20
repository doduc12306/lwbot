const config = {
  // Bot Owner, level 10 by default. A User ID. Should never be anything else than the bot owner's ID.
  'ownerID': '107599228900999168',

  // Bot Admins, level 9 by default. Array of user ID strings.
  'admins': [],

  // Bot Support, level 8 by default. Array of user ID strings
  'support': ['158272711146209281'],

  // Your Bot's Token. Available on https://discordapp.com/developers/applications/me
  'token': 'Mzc3MjA1MzM5MzIzMzY3NDI1.Dar1YA.0AIexER1daemthd1bG84DJJPHKQ',
  'giphy': 'y118kMRynO3XKfcHrRkpuWQ9CEXrqDfg',
  'debugtoken': 'Mzk0OTEzOTAzNDY2OTA1NjAx.DfXfBA.WbzI-ijiZYKxQJAftJ8S029RjE4',

  'client_secret': 'TWqz7cHZY5mrIaHpB1FFFVtSWXFocpce',

  'debugMode': process.argv.includes('-d') || process.argv.includes('--debug'),

  // Default per-server settings. New guilds have these settings.

  'defaultSettings' : {
    'prefix': '!w ',
    'modLogChannel': 'mod_logs',
    'modRole': 'Mods',
    'adminRole': 'Admins',
    'systemNotice': 'true', // "You do not have permission to use this command!" or something
    'welcomeEnabled': 'false',
    'welcomeChannel': 'welcome',
    'welcomeMessage': 'Welcome to the server, {{user}}!',
    'announcementsChannel': 'announcements',
    'botCommanderRole': 'Bot Commander'
  },

  // COLORS
  colors: {
    'red': '0xFF0000',
    'green': '0x59D851',
    'yellow': '0xFFFF00',
    'blurple': '0x7289DA',
    'purple': '0x821ABA',
    'black': '0x000000'
  },

  // PERMISSION LEVEL DEFINITIONS.

  permLevels: [
    // This is the lowest permisison level, this is for non-roled users.
    { level: 0,
      name: 'User',
      // Don't bother checking, just return true which allows them to execute any command their
      // level allows them to.
      check: () => true
    },

    { level: 2,
      name: 'Moderator',
      check: (message) => {
        try {
          const modRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.modRole.toLowerCase());
          if (modRole && message.member.roles.has(modRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    { level: 3,
      name: 'Administrator',
      check: (message) => {
        try {
          const adminRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.adminRole.toLowerCase());
          return ((adminRole && message.member.roles.has(adminRole.id)) || message.member.permissions.has('ADMINISTRATOR'));
        } catch (e) {
          return false;
        }
      }
    },

    {
      level: 4,
      name: 'Bot Commander',
      check: (message) => {
        try{
          const bcRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.botCommanderRole.toLowerCase());
          return (bcRole && message.member.roles.has(bcRole.id));
        } catch (e) {return false;}
      }
    },
    // This is the server owner.
    { level: 5,
      name: 'Server Owner',
      check: (message) => message.channel.type === 'text' ? (message.guild.owner.user.id === message.author.id ? true : false) : false
    },

    // Bot Support is a special in-between level that has the equivalent of server owner access
    // to any server they joins, in order to help troubleshoot the bot on behalf of owners.
    { level: 8,
      name: 'Bot Support',
      check: (message) => config.support.includes(message.author.id)
    },

    // Bot Admin has some limited access like rebooting the bot or reloading commands.
    { level: 9,
      name: 'Bot Admin',
      check: (message) => config.admins.includes(message.author.id)
    },

    // This is the bot owner, this should be the highest permission level available.
    // The reason this should be the highest level is because of dangerous commands such as eval
    // or exec (if the owner has that).
    { level: 10,
      name: 'Bot Owner',
      // Another simple check, compares the message author id to the one stored in the config file.
      check: (message) => message.client.config.ownerID === message.author.id
    }
  ]
};

module.exports = config;