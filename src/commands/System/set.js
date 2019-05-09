const Discord = require('discord.js');
const settingsFunctions = require('../../dbFunctions/message/settings').functions;

// Note the **destructuring** here. instead of `args` we have :
// [action, key, ...value]
// This gives us the equivalent of either:
// const action = args[0]; const key = args[1]; const value = args.slice(2);
// OR the same as:
// const [action, key, ...value] = args;
exports.run = async (client, message, [action, key, ...value]) => {
  const settingsSchema = require('../../dbFunctions/message/settings').functions.settingsSchema(message.guild.id);

  settingsSchema.findAll().then(data => {
    if(action === 'view') {
      if(key) {
        settingsFunctions.get(message.guild.id, key)
          .then(() => {
            data = data.filter(g => g.key === key)[0].dataValues;
            message.send(`:information_source: \`|\` ⚙️ **The value of** \`${key}\` **is** \`${data.value}\`**.**`);
          })
          .catch(() => message.send(`❌ \`|\` ⚙️ \`${key}\` **does not exist!** `));
      } else {
        const embed = new Discord.RichEmbed()
          .setColor(client.config.colors.green)
          .setTitle('Settings')
          .setFooter('Guild Settings');

        for (let settings of data) {
          settings = settings.dataValues;
          embed.addField(settings.key, settings.value, true);
        }

        message.send(embed);
      }
    } else

    if(action === 'edit') {
      if(!key) return message.send('❌ `|` ⚙️ **You didn\'t provide a key to edit!**');
      settingsFunctions.get(message.guild.id, key)
        .then(() => {
          if(value.length < 1) return message.send('❌ `|` ⚙️ **Please provide a new value.**');
          settingsFunctions.edit(client, message.guild.id, key, value.join(' '));
          client.settings.get(message.guild.id)[key] = value.join(' ');
          message.send(`✅ \`|\` ⚙️ \`${key}\` **was successfully edited to** \`${value.join(' ')}\`**.**`);
        })
        .catch(() => message.send(`❌ \`|\` ⚙️ \`${key}\` **does not exist!**`));
    } else

    if (action === 'add' || action === 'create') {
      if (!key) return message.send('❌ `|` ⚙️ **You didn\'t provide a key to add!**');
      settingsFunctions.get(message.guild.id, key)
        .then(() => message.send(`❌ \`|\` ⚙️ \`${key}\` **already exists!**`))
        .catch(() => {
          if (value.length < 1) return message.send('❌ `|` ⚙️ **Please provide a value.**');
          settingsFunctions.add(client, message.guild.id, key, value.join(' '));
          client.settings.get(message.guild.id)[key] = value.join(' ');
          message.send(`✅ \`|\` ⚙️ \`${key}\` **was successfully added with value** \`${value.join(' ')}\`**.**`);
        });
    } else

    if (action === 'del' || action === 'delete') {
      if(!key) return message.send('❌ `|` ⚙️ **You didn\'t provide a key to delete!**');
      settingsFunctions.get(message.guild.id, key)
        .then(async () => {
          const response = await client.awaitReply(message, `⚠️ \`|\` ⚙️ **Are you** __***SURE***__ **you want to delete** \`${key}\`**? This CANNOT be undone!** (y/n)`);
          if (['yes', 'y'].includes(response)) {
            settingsFunctions.delete(client, message.guild.id, key);
            delete client.settings.get(message.guild.id)[key];
            message.send(`✅ \`|\` ⚙️ **Successfully deleted** \`${key}\`**.**`);
          } else if (['no', 'n'].includes(response)) return message.send('✅ `|` ⚙️ **Action cancelled.**');
        })
        .catch(() => message.send(`❌ \`|\` ⚙️ \`${key}\` **does not exist!**`));
    } else

    if(action === 'reset') {
      if (!key) return message.send('❌ `|` ⚙️ **You didn\'t provide a key to reset!**');
      settingsFunctions.get(message.guild.id, key)
        .then(async () => {
          const response = await client.awaitReply(message, `⚠️ \`|\` ⚙️ **Are you** __***SURE***__ **you want to reset** \`${key}\`**? This CANNOT be undone!** (y/n)`);
          if (['yes', 'y'].includes(response)) {
            settingsFunctions.edit(client, message.guild.id, key, client.config.defaultSettings[key]);
            client.settings.get(message.guild.id)[key] = client.config.defaultSettings[key];
            message.send(`✅ \`|\` ⚙️ **Successfully reset** \`${key}\` **to** \`${client.config.defaultSettings[key]}\`**.**`);
          } else if (['no', 'n'].includes(response)) return message.send('✅ `|` ⚙️ **Action cancelled.**');
        })
        .catch(() => message.send(`❌ \`|\` ⚙️ \`${key}\` **does not exist!**`));
    } else {
      const embed = new Discord.RichEmbed()
        .setColor(client.config.colors.green)
        .setTitle('Settings')
        .setFooter('Guild Settings');

      for (let settings of data) {
        settings = settings.dataValues;
        embed.addField(settings.key, settings.value, true);
      }

      message.send(embed);
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['setting', 'settings', 'conf'],
  permLevel: 'Administrator',
  requiresEmbed: true
};

exports.help = {
  name: 'set',
  category: 'System',
  description: 'View or change settings for your server.',
  usage: 'set [view/edit/add/del/reset] [key] [value]'
};
