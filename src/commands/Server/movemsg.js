module.exports.run = async (client, message, args) => {
  if (!args[0]) return message.send(':x: `|` 📨 **You didn\'t give me the ID(s) of messages to move!**');
  if (/<#(\d{17,19})>/g.test(args[0])) return message.send(':x: `|` 📨 **Your first argument is a channel!** It must be a message ID, *then* the channel.');

  let deleteMode = false;
  if (message.content.endsWith('--delete')) {
    deleteMode = true;
    message.content = message.content.split('--delete')[0].trim(); // Take the delete flag off the end
  }

  let channelArg;
  const messageArgs = [];
  for (const argument of args) {
    // argument is a string
    // That regex pattern is a channel ID pattern
    if (/<#(\d{17,19})>/g.test(argument)) {
      channelArg = args[args.indexOf(argument)];
      break;
    }
    else messageArgs.push(argument);

    // This means we've reached the end of the argument chain and have found no channel mention.
    // argument.indexOf(args) could be 5 and the args.length could be 5. 
    // Subtract one because array lengths arent zero based
    if (args.indexOf(argument) === args.length - 1) return message.send(':x: `|` 📨 **You never mentioned a channel!**');
  }

  try {
    channelArg = message.functions.parseChannel(channelArg);
  } catch (e) { return message.send(':x: `|` 📨 **That channel does not exist!**'); }

  // Check to see if the bot has permission to create webhooks in the target channel
  if (!message.guild.me.permissionsIn(channelArg).has('MANAGE_WEBHOOKS')) return message.send(`:x: \`|\` 📨 **I don't have permission to manage webhooks in \`#${channelArg.name}\`!**`);

  const fetchedMessages = [];
  for (const messageArg of messageArgs) {
    message.channel.messages.fetch(messageArg)
      .then(msg => {
        fetchedMessages.push(msg);
        if (deleteMode) msg.delete();
      })
      .catch(e => {
        message.send(`:x: \`|\` 📨 **Couldn't find a message with ID \`${messageArg}\`!**`);
        client.logger.verbose('YOU CAN SAFELY IGNORE THIS ERROR');
        client.logger.verbose(e); // Yes, verbose, not error.
        client.logger.verbose('YOU CAN SAFELY IGNORE THIS ERROR');
      });
  } // I would have used map, in fact I did, but for some reason it never resolved the messages so

  await client.wait(messageArgs.length * (client.ws.ping / 10) * 100); // Wait for a spell to safely resolve the messages

  const firstMember = fetchedMessages[0];

  // Create a new webhook on the target channel formatted with the message's member's name and avatar
  let webhook = await channelArg.createWebhook(firstMember.member.displayName, {
    avatar: firstMember.author.displayAvatarURL(),
    reason: `Moving messages from #${message.channel.name} to #${channelArg.name}`
  }).catch(e => {
    message.send(`:x: \`|\` 📨 **There was an error creating the webhook to move messages to:** \`${e}\``);
    client.logger.error(e);
  });

  await webhook.send(`> *These messages were moved from ${message.channel.toString()}*`);
  await webhook.send('** **'); // Empty message, but not ;)

  let lastMessage;
  for (const msg of fetchedMessages) {
    // If this wasnt the first message and the message authors are different,
    if (lastMessage && lastMessage.author.id !== msg.author.id) {
      // Delete the initial webhook (the messages will still be retained)...
      webhook.delete(`Moving messages from #${message.channel.name} to #${channelArg.name} | Message author changed`);

      // ... and create a new one with the updated author info.
      webhook = await channelArg.createWebhook(msg.member.displayName, {
        avatar: msg.author.displayAvatarURL(),
        reason: `Moving messages from #${message.channel.name} to #${channelArg.name} | Message author changed`
      }).catch(e => {
        message.send(`:x: \`|\` 📨 **There was an error creating the webhook to move messages to:** \`${e}\``);
        client.logger.error(e);
      });
    }

    // Send the moved message's content to the webhook stylized with the author's name and avatar
    await webhook.send(msg.content);
    lastMessage = msg;

    if (fetchedMessages[fetchedMessages.length - 1] === lastMessage) {
      message.send(`:white_check_mark: \`|\` 📨 **Moved \`${fetchedMessages.length}\` messages!**`);
      webhook.delete(`Finished moving messages from #${message.channel.name} to #${channelArg.name}`);
    }
  }
};

exports.conf = {
  enabled: true,
  aliases: ['movemessage', 'movemsgs', 'movemessages', 'copymessage', 'copymsg', 'copymessages', 'copymsgs'],
  permLevel: 'Moderator',
  guildOnly: true
};

exports.help = {
  name: 'movemsg',
  description: 'Move/copy message(s) from one channel to another',
  usage: 'movemsg <message ID> [message ID...] <#channel> [--delete (will delete initial messages)]',
  category: 'Server'
};