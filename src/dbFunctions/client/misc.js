module.exports = (client) => {

  /*
  PERMISSION LEVEL FUNCTION

  This is a very basic permission system for commands which uses "levels"
  "spaces" are intentionally left black so you can add them if you want.
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command including the VERY DANGEROUS `eval` and `exec` commands!

  */
  client.permlevel = member => {
    if (!member.guild) return 0; // If the member given isn't in a guild (for DMs) return 0 - User for the permlevel

    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (member.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(member)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  };
  client.permLevel = member => { return client.permlevel(member); }; // An alias just in case I mess up permlevel casing

  /*
  SINGLE-LINE AWAITMESSAGE

  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...

  USAGE

  const response = await client.awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);

  */
  client.awaitReply = async (msg, question, limit = 300000) => {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };


  /*
  MESSAGE CLEAN FUNCTION

  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
  This is mostly only used by the Eval and Exec commands.
  */
  client.clean = async (client, text) => {
    if (text && text.constructor.name == 'Promise')
      text = await text;
    if (typeof evaled !== 'string')
      text = require('util').inspect(text, { depth: 0 });

    text = text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(client.token, 'fucking idiot, why are you trying to show my token? go to the dev page, lazy ass');

    return text;
  };

  client.loadCommand = (folder, commandName) => {
    try {
      const props = require(`../../commands/${folder}/${commandName}`);
      client.logger.log(`Loading Command: ${folder}/${props.help.name}`);

      /* Checks galore. */
      if(!props.run) return `${folder}/${commandName} does not have a run export`;

      if(!props.conf) return `${folder}/${commandName} does not have a conf export`;
      if(props.conf.enabled === undefined) return `${folder}/${commandName} does not have conf.enabled`; // undef because boolean (can be false)
      if(!props.conf.aliases) return `${folder}/${commandName} does not have conf.aliases`;
      if(props.conf.permlevel) return `${folder}/${commandName} has the wrong casing for permLevel (was "permlevel")`;
      if(!props.conf.permLevel) return `${folder}/${commandName} does not have conf.permLevel`;
      if(props.conf.guildOnly === undefined) return `${folder}/${commandName} does not have conf.guildOnly`; // undef because boolean (can be false)

      if(!props.help) return `${folder}/${commandName} does not have a help export`;
      if(!props.help.name) return `${folder}/${commandName} does not have help.name`;
      if(!props.help.description) return `${folder}/${commandName} does not have help.description`;
      if(!props.help.usage) return `${folder}/${commandName} does not have help.usage`;
      if(!props.help.category) return `${folder}/${commandName} does not have help.category`;
      /* // */

      client.commands.set(props.help.name, props);
      client.folder.set(props.help.name, folder);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${folder}/${commandName}: ${e.stack}`;
    }
  };

  client.unloadCommand = async (commandName) => {
    let command;
    let folder;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
      folder = client.folder.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
      folder = client.folder.get(commandName);
    }
    if (!command) return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias.`;

    if (command.shutdown) {
      await command.shutdown(client);
    }
    delete require.cache[require.resolve(`../../commands/${folder}/${commandName}.js`)];
    return false;
  };

  // <Object>.inspect() - shortcut to util.inspect()
  client.inspect = (obj, depth) => {
    if (!obj) throw new Error('No object given to inspect');
    return require('util').inspect(obj, { depth: typeof depth === 'number' ? depth : 0, colors: true });
  };

  client.verbose = content => client.logger.verbose(content);

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require('util').promisify(setTimeout);

};
