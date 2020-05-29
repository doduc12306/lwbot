const { client } = require('./startup');
const config = {
  // Bot Owner, level 10 by default. A User ID. Should never be anything else than the bot owner's ID.
  ownerID: '107599228900999168',

  // Bot Admins, level 9 by default. Array of user ID strings.
  admins: [],

  // Bot Support, level 8 by default. Array of user ID strings
  support: ['158272711146209281', '235920655823011840'], // [Gallium, Nen]

  // [ 2018.10.28 ] TOKENS REMOVED - ADDED TO .env FILE
  // [ 2018.10.28 ] TOKENS REGENERATED - don't even try, commit lurkers

  debugMode: false,
  verboseMode: false,
  sqLogMode: false,
  ciMode: false,
  noFileLog: false,

  // Default per-server settings. New guilds have these settings.
  defaultSettings: {
    'prefix': '!w ',
    'modLogChannel': 'mod_logs',
    'modRole': 'Mods',
    'adminRole': 'Admins',
    'botCommanderRole': 'Bot Commander',
    'ownerRole': 'Owners',
    'systemNotice': 'true', // "You do not have permission to use this command!" or something
    'welcomeEnabled': 'false',
    'welcomeChannel': 'welcome',
    'welcomeMessage': 'Welcome to the server, {{user}}!',
    'announcementsChannel': 'announcements',
    'capsThreshold': '80', // (80%), not 80 or more characters.
    'capsWarnEnabled': 'false',
    'capsDelete': 'false',
    'staffBypassesLimits': 'true',
    'xpLevelUpEnabled': 'false',
    'xpLevelUpMessage': '⬆ **{{user}} just advanced to level {{level}}!**',
    'deleteCommand': 'false', // Delete command after it's sent. This can save some memory for command edits
    'accentColor': '0x00d564',
    'owoMode': 'false'
  },

  defaultEvents: {
    'messageUpdate': false,
    'messageDelete': false,
    'channelCreate': false,
    'channelDelete': false,
    'guildMemberAdd': false,
    'guildMemberRemove': false
  },

  // COLORS
  colors: {
    'red': '0xFF0000',
    'accentColor': '0x00d564',
    'green': '0x00d564',
    'yellow': '0xFFFF00',
    'blurple': '0x7289DA',
    'purple': '0x821ABA',
    'black': '0x000000',
    'white': [255, 255, 254] // rgb // embeds don't like 0xFFFFFF for some reason.
  },

  // PERMISSION LEVEL DEFINITIONS.
  permLevels: [
    // This is the lowest permissison level, this is for non-roled users.
    {
      level: 0,
      name: 'User',
      // Don't bother checking, just return true which allows them to execute any command their
      // level allows them to.
      check: () => true
    },

    {
      level: 1,
      name: 'DJ',
      check: member => {
        try {
          const djRole = member.guild.roles.cache.find(r => r.name.toLowerCase === 'dj');
          if (djRole && member.roles.cache.has(djRole.id)) return true;
        } catch (e) { return false; }
      }
    },

    {
      level: 2,
      name: 'Moderator',
      check: member => {
        try {
          const modRole = member.guild.roles.cache.find(r => r.name.toLowerCase() === client.settings.get(member.guild.id).modRole.toLowerCase());
          if (modRole && member.roles.cache.has(modRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    {
      level: 3,
      name: 'Administrator',
      check: member => {
        try {
          const adminRole = member.guild.roles.cache.find(r => r.name.toLowerCase() === client.settings.get(member.guild.id).adminRole.toLowerCase());
          return ((adminRole && member.roles.cache.has(adminRole.id)) || member.permissions.has('ADMINISTRATOR'));
        } catch (e) {
          return false;
        }
      }
    },

    {
      level: 4,
      name: 'Bot Commander',
      check: member => {
        try {
          const bcRole = member.guild.roles.cache.find(r => r.name.toLowerCase() === client.settings.get(member.guild.id).botCommanderRole.toLowerCase());
          return (bcRole && member.roles.cache.has(bcRole.id));
        } catch (e) { return false; }
      }
    },

    // This is the server owner, or if they have an Owner role, since a lot of servers have multiple owners.
    {
      level: 5,
      name: 'Server Owner',
      check: member => {
        if (!member.guild) return false;
        if (member.guild.owner.user.id !== member.user.id) {
          const ownerRole = member.guild.roles.cache.find(r => r.name.toLowerCase() === client.settings.get(member.guild.id).ownerRole.toLowerCase());
          return ownerRole && member.roles.cache.has(ownerRole.id);
        } else return true;
      }
    },

    { level: 6, name: 'Level 6 Placeholder', check: () => false },
    { level: 7, name: 'Level 7 Placeholder', check: () => false },

    // Bot Support is a special in-between level that has the equivalent of server owner access
    // to any server they joins, in order to help troubleshoot the bot on behalf of owners.
    {
      level: 8,
      name: 'Bot Support',
      check: member => config.support.includes(member.user.id)
    },

    // Bot Admin has some limited access like rebooting the bot or reloading commands.
    {
      level: 9,
      name: 'Bot Admin',
      check: member => config.admins.includes(member.user.id)
    },

    // This is the bot owner, this should be the highest permission level available.
    // The reason this should be the highest level is because of dangerous commands such as eval
    // or exec (if the owner has that).
    {
      level: 10,
      name: 'Bot Owner',
      // Another simple check, compares the message author id to the one stored in the config file.
      check: member => config.ownerID === member.user.id
    }
  ]
};

module.exports = config;