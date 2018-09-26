const Sequelize = require('sequelize');

module.exports = (client) => {

  var bank = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'databases/bank.sqlite'
  });

  client.bank = bank.define('bank', {
    user: {
      type: Sequelize.STRING,
      allowNull: false
    },
    balance: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });
  client.bank.sync();

  client.bank.add = (userID, amount) => {
    client.bank.findOne({where: {user: userID}}).then(async user => {
      if(user === null) {
        await client.bank.create({user: userID, balance: 1000});
        await client.bank.update({balance: user.balance + amount}, {where: {user: userID}});
        client.bank.sync();
      }
      else {
        await client.bank.update({balance: user.balance + amount}, {where: {user: userID}});
        client.bank.sync();
      }
    });
  };

  client.bank.subtract = (userID, amount) => {
    client.bank.findOne({where: {user: userID}}).then(async user => {
      if(user === null) {
        await client.bank.create({user: userID, balance: 1000});
        await client.bank.update({balance: user.balance - amount}, {where: {user: userID}});
        client.bank.sync();
      }
      else {
        await client.bank.update({balance: user.balance - amount}, {where: {user: userID}});
        client.bank.sync();
      }
    });
  };

  client.bank.set = (userID, amount) => {
    client.bank.findOne({where: {user: userID}}).then(async user => {
      if(user === null) {
        await client.bank.create({user: userID, balance: 1000});
        await client.bank.update({balance: amount}, {where: {user: userID}});
        client.bank.sync();
      }
      else {
        await client.bank.update({balance: amount}, {where: {user: userID}});
        client.bank.sync();
      }
    });
  };

  client.bank.get = async userID => {
    return new Promise((resolve) => {
      client.bank.findOne({where: {user: userID}}).then(async user => {
        if(user === null) {
          await client.bank.create({user: userID, balance: 1000});
        }
        resolve(user.balance);
      });
    });
  };


  /*
  PERMISSION LEVEL FUNCTION

  This is a very basic permission system for commands which uses "levels"
  "spaces" are intentionally left black so you can add them if you want.
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command including the VERY DANGEROUS `eval` and `exec` commands!

  */
  client.permlevel = message => {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  };

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
      text = require('util').inspect(text, {depth: 0});

    text = text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(client.token, 'fucking idiot, why are you trying to show my token? go to the dev page, lazy ass');

    return text;
  };

  client.loadCommand = (commandName) => {
    try {
      const props = require(`../commands/${commandName}`);
      client.logger.log(`Loading Command: ${props.help.name}`);
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  };

  client.unloadCommand = async (commandName) => {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias.`;

    if (command.shutdown) {
      await command.shutdown(client);
    }
    delete require.cache[require.resolve(`../commands/${commandName}.js`)];
    return false;
  };

  /* MISCELANEOUS NON-CRITICAL FUNCTIONS */

  // EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
  // later, this conflicts with native code. Also, if some other lib you use does
  // this, a conflict also occurs. KNOWING THIS however, the following 2 methods
  // are, we feel, very useful in code.

  // <String>.toProperCase() returns a proper-cased string such as:
  // "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };

  // <String>.replaceAll() returns a string that replaces all of a specific text, for example:
  // "Welcome to the server, {{user}}! Please have a fun time here, {{user}}!" returns "server, @User! ... here, @User!"
  String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
  };

  // <Array>.random() returns a single random element from an array
  // [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
  Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
  };

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require('util').promisify(setTimeout);

  client.xpLockSet = new Set();

  // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
  process.on('uncaughtException', (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    if (errorMsg.trim().includes('at WebSocketConnection.onError')) client.logger.log('Disconnected! Lost connection to websocket', 'disconnect');
    else client.logger.error(`Uncaught Exception: ${errorMsg}`);
    process.exit(1);
  });

  process.on('unhandledRejection', err => {
    client.logger.error(`Unhandled rejection: ${err.stack}`);
  });

  client.on('disconnect', () => client.logger.log('Client disconnected!', 'disconnect'));
  client.on('reconnecting', () => client.logger.log('Reconnecting...', 'reconnecting'));
  client.on('resume', replayed => client.logger.log(`Client resumed! Replayed ${replayed} events`, 'resume'));
  client.on('warn', info => client.logger.warn(`Warning: "${info}"`));
};
