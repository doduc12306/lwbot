const { RichEmbed } = require('discord.js');
module.exports = async (client, message) => {

  // Message send function, pretty much extends message.channel.send/message.edit in that it allows the user to edit their command message and it runs that instead
  message.send = (content, options) => {
    return new Promise(async (resolve, reject) => {
      if (!content) {
        content = '[Empty Message]';
        reject(new Error('Empty message detected!'));
      }

      // command editing functionality
      if (message.edited) return message.channel.fetchMessage(client.msgCmdHistory[message.id])
        .then(async msg => {
          const embedC = typeof content === 'object'; // embedC = "embed Check"

          options = {
            embed: embedC
              ? content
              : msg.embeds.length !== 0
                ? {} : {},
            code: options
              ? options.code
                ? options.code
                : undefined
              : undefined,
            split: options
              ? options.split
                ? options.split
                : undefined
              : undefined
          };

          if (msg.reactions.size > 0) msg.clearReactions();

          return msg.edit(embedC ? '' : content, options) // If content === object, send (text) nothing. Else, send the content
            .then(m => { return resolve(m); })
            .catch(e => { return reject(e); });
        })
        .catch(e => {
          if (e.message === 'Unknown Message') {
            message.channel.send(content, options ? options : null)
              .then(msg => {
                client.msgCmdHistory[message.id] = msg.id;
                return resolve(msg);
              })
              .catch(e => { return reject(new Error(e)); });
          } else return reject(new Error(e));
        });

      // owo mode functionality
      if (client.settings.get(message.guild.id)['owoMode'] === 'true' && !(content instanceof RichEmbed)) {
        content = content
          .replaceAll('r', 'w')
          .replaceAll('l', 'w');

        const ous = ['o', 'O', '0', 'u', 'U'];
        const ws = ['w', 'W'];

        content += ` ${[`${ous.randomElement()}${ws.randomElement()}${ous.randomElement()}`, ':3c'].randomElement()}`;
      }

      // Checks if msgCmdHistory (Set) has the id of the message. If not, it sends a new message.
      // This is placed after the initial edit statement because it will send a message regardless.
      if (!client.msgCmdHistory.has(message.id)) {
        if (options) return message.channel.send(content, options).then(msg => {
          client.msgCmdHistory[message.id] = msg.id;
          return resolve(msg);
        }).catch(e => { return reject(new Error(e)); });
        else return message.channel.send(content).then(msg => {
          client.msgCmdHistory[message.id] = msg.id;
          return resolve(msg);
        }).catch(e => { return reject(new Error(e)); });
      }
    });
  };

  // Other various functions
  message.functions = {
    /** 
     * Parses a role from a given role name or role snowflake
     * @param {String} data
     * @returns {Role}
     */
    parseRole: data => {
      if (message.channel.type !== 'text') throw new Error('I can\'t find a role if I\'m not in a guild!');
      if (!data) throw new Error('You didn\'t give me anything to find a role from!');
      if (message.mentions.roles.size === 0) {
        let role = message.guild.roles.get(data);
        if (role === undefined) {
          role = message.guild.roles.find(r => r.name.toLowerCase().includes(data.toLowerCase()));
          if (!role) throw new Error('I couldn\'t find that role! ');
          else return role;
        } else return role;
      } else {
        const role = message.mentions.roles.first();
        return role;
      }
    },
    /** 
     * Parses a user from a given user name or user snowflake
     * @param {String} data
     * @returns {User}
     */
    parseUser: data => {
      if (!data) throw new Error('You didn\'t give me anything to find a user from!');
      if (message.mentions.users.size === 0) {
        let user = client.users.get(data);
        if (user === undefined) {
          user = client.users.find(r => (r.username.toLowerCase().includes(data.toLowerCase()) || r.tag.toLowerCase() === data.toLowerCase()));
          if (!user) throw new Error('I couldn\'t find that user!');
          else return user;
        } else return user;
      } else {
        const user = message.mentions.users.first();
        return user;
      }
    },
    /** 
     * Parses a member from a given member username or member snowflake
     * @param {String} data
     * @returns {GuildMember}
     */
    parseMember: data => {
      if (message.channel.type !== 'text') throw new Error('I can\'t find a member if I\'m not in a guild!');
      if (!data) throw new Error('You didn\'t give me anything to find a member from!');
      if (message.mentions.members.size === 0) {
        let member = message.guild.members.get(data);
        if (member === undefined) {
          member = message.guild.members.find(r => (r.user.username.toLowerCase().includes(data.toLowerCase()) || r.user.tag.toLowerCase() === data.toLowerCase()));
          if (!member) throw new Error('I couldn\'t find that member!');
          else return member;
        } else return member;
      } else {
        const member = message.mentions.members.first();
        return member;
      }
    },
    /** 
     * Parses a channel from a given channel name or channel snowflake
     * CANNOT PARSE DMS
     * @param {String} data
     * @returns {GuildChannel}
     */
    parseChannel: data => {
      if (!message.guild) throw new Error('I can\'t find a channel if I\'m not in a guild!');
      if (!data) return undefined;
      if (data.startsWith('<#') && data.endsWith('>')) { // data === <#ID>
        const channel = message.guild.channels.get(data.substring(2, data.length - 1));
        if (!channel) throw new Error('Channel does not exist');
        return channel;
      }
      else if (data.startsWith('#')) { // data === #channel
        data = data.substring(1);
        const channel = message.guild.channels.find(g => g.name.includes(data));
        if (!channel) throw new Error('Channel does not exist');
        return channel;
      }
      else { // data === ID
        const channel = message.guild.channels.get(data);
        if (!channel) throw new Error('Channel does not exist');
        return channel;
      }
    }
  };
};