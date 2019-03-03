const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  const level = client.permlevel(message.member);
  // If no specific command is called, show all filtered commands.
  if (!args[0]) {
    const prefix = message.guild ? await message.guild.settings.get('prefix') : client.config.defaultSettings.prefix;

    // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
    const myCommands = message.guild ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.enabled && !cmd.conf.hidden) : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true && cmd.conf.enabled && !cmd.conf.hidden);

    // Here we have to get the command names only, and we use that array to get the longest name.
    // This make the help commands "aligned" in the output.
    const commandNames = myCommands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    let currentCategory = '';
    let output = `[Use ${prefix}help <command> for details]\n`;
    const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1);
    sorted.forEach(c => {
      const cat = c.help.category;
      if (currentCategory !== cat) {
        output += `\u200b\n== ${cat} ==\n`;
        currentCategory = cat;
      }
      output += `${prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
    });
    if(message.channel.type === 'dm') output += `\n\n(Run ${prefix}help in a guild to see more commands!)`;
    await message.react('✅');
    await message.author.send(output, { code: 'asciidoc', split: true });
  } else {
    // Show individual command's help.
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      let desc = `**Description:** ${command.help.description}\n**Usage:** ${command.help.usage}\n**Required Perm:** ${command.conf.permLevel}\n**Category:** ${command.help.category}`;

      if (command.conf.aliases.join(', ')) desc += `\n**Aliases:** ${command.conf.aliases.join(', ')}`;

      if (level < client.levelCache[command.conf.permLevel]) desc += ':x: **You do not have access to this command.**';

      const cmdEmbed = new Discord.RichEmbed()
        .setTitle(command.help.name.toProperCase())
        .setDescription(desc)
        .setColor(client.config.colors.green)
        .setFooter('<required arguments> | [optional arguments]')
        .setTimestamp();

      message.send(cmdEmbed);

    } else message.send(`:x: **I couldn't find the command** \`${command}\`!`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['h', 'halp', 'hlp', 'commands', 'cmds'],
  permLevel: 'User',
  requiresEmbed: true
};

exports.help = {
  name: 'help',
  category: 'System',
  description: 'Displays all the available commands for your permission level.',
  usage: 'help [command]'
};
