const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  const level = client.permlevel(message.member);
  const myCommands = message.guild 
    ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.enabled && !cmd.conf.hidden)
    : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true && cmd.conf.enabled && !cmd.conf.hidden);
  const prefix = message.guild ? client.settings.get(message.guild.id)['prefix'] : client.config.defaultSettings['prefix'];

  if(!args[0]) {
    // Display all commands
    let currentCategory = '';
    let output = '```fix\nAvailable Commands\n```';

    const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1);
    sorted.forEach(c => {
      const cat = c.help.category;
      if (currentCategory !== cat) {
        output += `\n**${cat}:** `;
        currentCategory = cat;
      }
      output += `\`${c.help.name}\` `;
    });

    if(!message.guild) output += '\n\n:information_source: `|` **You aren\'t in a guild.** Run this command again in a server to see more commands!';

    output += `\n\n\`\`\`fix\nRun ${prefix}help <command/category> for more details.\n\`\`\``;

    message.send(output);

  } else {
    if(client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]))) {
      // Display the individual command's help.
      let command = args[0];
      command = client.commands.get(command) || client.commands.get(client.aliases.get(command));
      let desc = `**Description:** ${command.help.description}\n**Usage:** ${command.help.usage}\n**Permission level:** ${command.conf.permLevel}\n**Category:** ${command.help.category}`;

      if (command.conf.aliases.join(', ')) desc += `\n**Aliases:** ${command.conf.aliases.join(', ')}`;

      if (!message.guild && command.conf.guildOnly) desc += '\n❌ **This command is guild only.**';
      if (level < client.levelCache[command.conf.permLevel]) desc += '\n❌ **You do not have access to this command.**';

      const cmdEmbed = new Discord.MessageEmbed()
        .setTitle(command.help.name.toProperCase())
        .setDescription(desc)
        .setColor(client.accentColor)
        .setFooter('<required arguments> | [optional arguments]')
        .setTimestamp();

      message.send(cmdEmbed);
    } else if(myCommands.filter(g => g.help.category === args[0]).size !== 0) {
      // Display all commands for the given category
      const commandsInCategory = myCommands.filter(g => g.help.category === args[0]);
      const sorted = commandsInCategory.array().sort((p, c) => p.help.name > c.help.name ? 1 : -1);

      let msg = `\`\`\`fix\nAvailable Commands for Category: ${args[0]}\n\`\`\`\n`;

      sorted.forEach(c => {
        msg += `\`${prefix}${c.help.name}\` - ${c.help.description}\n`;
      });
      
      msg += `\n\`\`\`fix\nFor more help, run ${prefix}help <command name>\n\`\`\``;

      message.send(msg);

    } else message.send('❌ **I can\'t find that command or category!**');
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['h', 'halp', 'hlp', 'commands', 'cmds', '?'],
  permLevel: 'User',
  requiresEmbed: true
};

exports.help = {
  name: 'help',
  category: 'System',
  description: 'Displays all the available commands for your permission level.',
  usage: 'help [command]'
};
