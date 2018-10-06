const Discord = require('discord.js');

exports.run = async (client, message, args, level) => {
  // If no specific command is called, show all filtered commands.
  if (!args[0]) {
    const prefix = message.guild ? await message.guild.settings.get('prefix') : client.config.defaultSettings.prefix;

    // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
    const myCommands = message.guild ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level) : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true);

    // Here we have to get the command names only, and we use that array to get the longest name.
    // This make the help commands "aligned" in the output.
    const commandNames = myCommands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    let currentCategory = '';
    let output = `[Use ${prefix}help <commandname> for details]\n`;
    const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1);
    sorted.forEach(c => {
      const cat = c.help.category;
      if (currentCategory !== cat) {
        output += `\u200b\n== ${cat} ==\n`;
        currentCategory = cat;
      }
      output += `${prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
    });
    await message.react('✅');
    await message.author.send(output, { code: 'asciidoc', split: true });
  } else {
    // Show individual command's help.
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      if (level < client.levelCache[command.conf.permLevel]) return message.channel.send(':x: You do not have access to this command!');

      var cmdEmbed = new Discord.RichEmbed()
        .setTitle(`\`${command.help.name}\``)
        .setDescription(`${command.help.category} | ${command.help.description}`)
        .addField('Usage', command.help.usage)
        .addField('Perm Level', command.conf.permLevel)
        .setColor(client.config.colors.green)
        .setFooter('All <arguments> are required · All [arguments] are optional');

      if (command.conf.aliases.join(', ')) cmdEmbed.addField('Aliases', command.conf.aliases.join(', '));

      message.channel.send(cmdEmbed);

    } else { message.channel.send(`:x: I couldn't find the command ${command}!`); }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['h', 'halp', 'hlp', 'commands', 'cmds'],
  permLevel: 'User'
};

exports.help = {
  name: 'help',
  category: 'System',
  description: 'Displays all the available commands for your permission level.',
  usage: 'help [command]'
};
