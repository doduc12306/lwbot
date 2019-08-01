
const Discord = require('discord.js');
const settingsFunctions = require('../../dbFunctions/message/settings').functions;

exports.run = async (client, message, args) => {
  const guildSettings = client.settings.get(message.guild.id);
  const action = args[0];
  if (!action) return viewSettings();

  if (action === 'view') {
    if (!args[1]) return viewSettings();

    if (!isNaN(args[1])) { // If args[1] is a number (not not a number)
      const setting = viewSettings(+args[1], null);
      if (!setting) return message.send(':x: `|` ⚙ **That setting ID does not exist!**');
      message.send(`⚙ **Setting**\n\`\`\`xl\n[${setting.id}] ${setting.key} - ${setting.value}\n\`\`\``);
    } else { // else - string
      const setting = viewSettings(null, args.slice(1).join(' '));
      if (!setting) return message.send(':x: `|` ⚙ **That setting does not exist!**');
      message.send(`⚙ **Setting**\n\`\`\`xl\n[${setting.id}] ${setting.key} - ${setting.value}\n\`\`\``);
    }
  } else if (action === 'edit') {
    let id = args[1];
    let newValue = args.slice(2).join(' ');

    if (!id) return message.send(':x: `|` ⚙ **Missing a setting to edit!**');
    if (isNaN(+id)) return message.send(`:x: \`|\` ⚙ \`${id}\` **is not a setting ID!**`);
    if (!newValue) return message.send(':x: `|` ⚙ **Missing a new value!**');

    // if "[ID]" convert to "ID"
    if (new RegExp(`^\[${id}\]$`).test(id)) id = id.substring(1, id.length - 1); // eslint-disable-line no-useless-escape
    const setting = viewSettings(id, null);
    if (!setting) return message.send(`:x: \`|\` ⚙ **Setting ID** \`[${id}]\` **does not exist!**`);

    // Checks
    if (['Enabled', 'Disabled'].includes(setting.value) && !(/(en|dis)abled?/gi.test(newValue)))
      return message.send(':x: `|` ⚙ **Invalid new value. Must be one of:** `enable` **or** `disable`**.** ');
    if (!isNaN(+setting.value) && isNaN(+newValue))
      return message.send(':x: `|` ⚙ **Invalid new value. Must be a number.**');
    if (/^"#/.test(setting.value) && !(/^#/.test(newValue)))
      return message.send(':x: `|` ⚙ **Invalid new value. Must be a hex color beginning with** `#`**.**');
    if (setting.key === 'Caps Threshold' && !(/\d{1,3}%/.test(newValue)))
      return message.send(':x: `|` ⚙ **Invalid new value. Must be a percentage.**');

    // Edits
    if (setting.key.toLowerCase().includes('channel') && message.mentions.CHANNELS_PATTERN.test(newValue))
      newValue = newValue.substring(2, newValue.length - 1);
    if (setting.key.toLowerCase().includes('role') && message.mentions.ROLES_PATTERN.test(newValue))
      newValue = newValue.substring(2, newValue.length - 1);
    if (/enabled?/gi.test(newValue))
      newValue = 'true';
    if (/disabled?/gi.test(newValue))
      newValue = 'false';
    if (/\d{1,3}%/.test(newValue))
      newValue = newValue.substring(0, newValue.length - 1);

    settingsFunctions.edit(client, message.guild.id, setting.originalSetting, newValue)
      .then(async () => {
        await (client.settings.get(message.guild.id)[setting.originalSetting] = newValue);
        const newSetting = await viewSettings(setting.id, null);
        message.send(`:white_check_mark: \`|\` ⚙ **Setting edited!**\n\`\`\`xl\n[${newSetting.id}] ${newSetting.key} - ${newSetting.value}\n\`\`\``);
      }).catch(e => { return message.send(`:x: \`|\` ⚙ **There was an error editing the setting:**\n\`\`\`${e.stack}\`\`\``); });

  } else if (action === 'reset') {
    const settingToReset = args.slice(1).join(' ');

    if (!isNaN(settingToReset)) { // If args[1] is a number (not not a number)
      const setting = viewSettings(+settingToReset, null);
      if (!setting) return message.send(':x: `|` ⚙ **That setting ID does not exist!**');

      // Ask the user if they are sure they want to reset
      const response = await client.awaitReply(message, `:warning: \`|\` ⚙ **Are you sure you want to reset this setting? This CANNOT be undone!** (yes/no)\n\`\`\`xl\n[${setting.id}] ${setting.key} - ${setting.value}\n\`\`\``);

      // If the user said "y" or "yes"
      if (/y(es)?/i.test(response)) {
        settingsFunctions.edit(client, message.guild.id, setting.originalSetting, client.config.defaultSettings[setting.originalSetting])
          .then(async () => {
            await (client.settings.get(message.guild.id)[setting.originalSetting] = client.config.defaultSettings[setting.originalSetting]);
            const newSetting = await viewSettings(+settingToReset, null);
            message.send(`:white_check_mark: \`|\` ⚙ **Setting reset!**\n\`\`\`xl\n[${newSetting.id}] ${newSetting.key} - ${newSetting.value}\n\`\`\``);
          }).catch(e => { return message.send(`:x: \`|\` ⚙ **There was an error resetting the setting:**\n\`\`\`${e}\`\`\``); });
        // If the user said "n" or "no"
      } else if (/no?/i.test(response)) {
        return message.send('⚙ **Action cancelled.**');
        // else
      } else return message.send(':x: `|` ⚙ **Invalid response.**');
    } else { // else - string
      const setting = viewSettings(null, settingToReset);
      if (!setting) return message.send(':x: `|` ⚙ **That setting does not exist!**');

      // Ask the user if they are sure they want to reset
      const response = await client.awaitReply(message, `:warning: \`|\` ⚙ **Are you sure you want to reset this setting? This CANNOT be undone!** (yes/no)\n\`\`\`xl\n[${setting.id}] ${setting.key} - ${setting.value}\n\`\`\``);

      // If the user said "y" or "yes"
      if (/y(es)?/i.test(response)) {
        settingsFunctions.edit(client, message.guild.id, setting.originalSetting, client.config.defaultSettings[setting.originalSetting])
          .then(async () => {
            await (client.settings.get(message.guild.id)[setting.originalSetting] = client.config.defaultSettings[setting.originalSetting]);
            const newSetting = await viewSettings(+settingToReset, null);
            message.send(`:white_check_mark: \`|\` ⚙ **Setting reset!**\n\`\`\`xl\n[${newSetting.id}] ${newSetting.key} - ${newSetting.value}\n\`\`\``);
          }).catch(e => { return message.send(`:x: \`|\` ⚙ **There was an error resetting the setting:**\n\`\`\`${e}\`\`\``); });
        // If the user said "n" or "no"
      } else if (/no?/i.test(response)) {
        return message.send('⚙ **Action cancelled.**');
        // else
      } else return message.send(':x: `|` ⚙ **Invalid response.**');
    }
  } else return viewSettings();

  /**
   * Get a setting [by ID or key]
   * @param {Number} [id=undefined] ID of the setting
   * @param {String} [key=undefined] Name of the setting
   * @returns id: Number, key: String, value: String
   */
  function viewSettings(id, key) {
    /* * * * * * * * * * * * * * LEGEND * * * * * * * * * * * * * * * *
    *   // Example output:                                             *
    *   [1] Prefix - !w                                                *
    *                                                                  *
    *   [1]      = input / IDToPrettySetting                           *
    *   Prefix   = input / reverse search IDToPrettySetting            *
    *   !w       = prettySettings                                      *
    *   <prefix> = originalSetting // Not shown in the command output  *
     * * * * * * * * * * * * * * LEGEND * * * * * * * * * * * * * * * */

    // Makes settings look nicer to display
    const prettySettings = new Discord.Collection();
    for (const setting of Object.entries(guildSettings)) {
      const key = setting[0];
      const value = setting[1];

      const prettyKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); });
      const prettyValue = (value) => {
        // Formatting
        if (value === 'true') value = 'Enabled';
        if (value === 'false') value = 'Disabled';
        if (/^0x/.test(value)) value = value.replace(/^0x/, '#');
        if (!isNaN(+value)) value = +value; // If the parsed value is a number (not not a number)
        if (prettyKey === 'Caps Threshold') value = `${value}%`;
        if (prettyKey.endsWith('Channel')) value = `#${value}`;
        if (prettyKey.endsWith('Role')) value = `@${value}`;

        //if (typeof value === 'string' && !['Enabled', 'Disabled'].includes(value)) value = `"${value}"`;
        return value;
      };

      prettySettings[prettyKey] = prettyValue(value);
    }

    // Maps each pretty setting to an ID that can be referenced later
    const IDToPrettySettings = new Discord.Collection();
    let i = 1;
    for (const prettySetting of Object.entries(prettySettings)) {
      IDToPrettySettings[i] = prettySetting[0]; // Set the setting key to an ID
      i++;
    }

    // Maps each original setting to an ID that can be referenced later
    const IDToOriginalSettings = new Discord.Collection();
    let j = 1;
    for (const originalSetting of Object.entries(guildSettings)) {
      IDToOriginalSettings[j] = originalSetting[0];
      j++;
    }

    // If a setting ID is passed in, grab all the data associated with that ID
    if (id) {
      const mappedSetting = IDToPrettySettings[id];
      const prettySetting = prettySettings[mappedSetting];
      const originalSetting = IDToOriginalSettings[id];

      if (!mappedSetting || !prettySetting || !originalSetting) return undefined;
      return { id, key: mappedSetting, value: prettySetting, originalSetting };
    }

    if (key) {
      const id = getKeyByValue(IDToPrettySettings, key);
      const prettySetting = prettySettings[key];
      const originalSetting = toCamelCase(key);

      if (!id || !prettySetting || !originalSetting) return undefined;
      return { id, key, value: prettySetting, originalSetting };
    }

    let content = '⚙ **Server settings:**\n```xl\n';
    for (const mappedSetting of Object.entries(IDToPrettySettings)) {
      content += `[${mappedSetting[0]}] ${mappedSetting[1]} - ${prettySettings[mappedSetting[1]]}\n`;
    }
    content += '\n```';
    if (client.settings.get(message.guild.id)['owoMode'] === 'true') content += '⚠ ***OWO MODE ENABLED! SETTING NAMES/VALUES ARE INCORRECT!*** ⚠\n';

    message.send(content);

  }

  function toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  // If a setting key is passed in, grab all the data associated with that key.
  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['setting', 'settings', 'conf'],
  permLevel: 'Administrator'
};

exports.help = {
  name: 'set',
  category: 'Server',
  description: 'View or change settings for your server.',
  usage: 'set [view <setting name / ID>]\nset edit <setting ID> <new value>\nset reset <setting name / ID>'
};
