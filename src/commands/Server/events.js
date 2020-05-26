const GuildEvents = require('../../dbFunctions/message/events');
const { prettyEvents } = require('../../util/prettyFlags');

module.exports.run = (client, message, [toggle, ...eventName]) => {
  const events = new GuildEvents(message.guild.id);

  if (!toggle) {
    message.send(`⚙️ **Server event settings:**\`\`\`${formattedEvents(events.cachedEvents)}\`\`\`\n⚙️ **If you want to change one of these event settings, type** \`${message.guild.settings['prefix']}events <enable/disable> <event name>\``);
  } else if (/enabled?/.test(toggle.toLowerCase())) {
    if (eventName.length === 0) return message.send(':x: `|` ⚙️ **Missing event name to enable!**');
    eventName = eventName.join(' ');
    eventName = eventName.toProperCase();

    const actualEvent = getKeyByValue(prettyEvents, eventName);
    if (!actualEvent) return message.send(':x: `|` ⚙️ **That event doesn\'t exist!**');

    events.enable(actualEvent)
      .then(() => message.send(`✅ \`|\` ⚙️ **Event enabled!**\n\`\`\`${formattedEvent(actualEvent, events.cachedEvents)}\`\`\``))
      .catch(e => {
        message.send(`:x: \`|\` ⚙️ **${e}**`);
        // Im comfortable doing this only because i know exactly what the errors will be, instead of it being thrown from a database error.
      });

    // Notify the user if there is no modlog channel set.
    const modLogChannel = message.guild.channels.cache.find(g => g.name.toLowerCase() === message.guild.settings['modLogChannel'].toLowerCase());
    if(!modLogChannel) message.send(`:warning: \`|\` ⚙️ **Even though this event has been enabled, there is no modlog channel set, so there will be no logs.** For more information type \`${message.guild.settings['prefix']}set\`.`);

  } else if (/disabled?/.test(toggle.toLowerCase())) {
    if (eventName.length === 0) return message.send(':x: `|` ⚙️ **Missing event name to disable!**');
    eventName = eventName.join(' ');
    eventName = eventName.toProperCase();

    const actualEvent = getKeyByValue(prettyEvents, eventName);
    if (!actualEvent) return message.send(':x: `|` ⚙️ **That event doesn\'t exist!**');

    events.disable(actualEvent)
      .then(() => message.send(`✅ \`|\` ⚙️ **Event disabled!**\n\`\`\`${formattedEvent(actualEvent, events.cachedEvents)}\`\`\``))
      .catch(e => {
        message.send(`:x: \`|\` ⚙️ **${e}**`);
        // Im comfortable doing this only because i know exactly what the errors will be, instead of it being thrown from a database error.
      });
  } else {
    this.run(client, message, []);
  }

};

function formattedEvents(events) {
  let full = '';
  for (const event in events) {
    full += prettyEvents[event];

    if (events[event]) full += ' - Enabled\n';
    else full += ' - Disabled\n';
  }
  return full;
}

function formattedEvent(event, eventCache) {
  let full = '';
  full += prettyEvents[event];
  if (eventCache[event]) full += ' - Enabled';
  else full += ' - Disabled';

  return full;
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

exports.conf = {
  enabled: true,
  aliases: [],
  guildOnly: true,
  permLevel: 'Administrator'
};

exports.help = {
  name: 'events',
  description: 'Enable/disable logging some events in your guild',
  usage: 'events <enable/disable> <event name>',
  category: 'Server'
};