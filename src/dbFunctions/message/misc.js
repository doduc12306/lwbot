const { MessageEmbed, User, GuildMember } = require('discord.js');
module.exports = async (client, message) => {

  // Message send function, pretty much extends message.channel.send/message.edit in that it allows the user to edit their command message and it runs that instead
  message.send = (content, options) => {
    return new Promise((resolve, reject) => {
      if (!content) { // Accidental empty message handling
        content = '[Empty Message]';
        reject('Empty message detected!');
      }

      // command editing functionality
      if (message.edited) return message.channel.messages.fetch(client.msgCmdHistory[message.id])
        .then(async msg => {
          const embedC = content instanceof MessageEmbed; // embedC = "embed Check"

          options = {
            embed: embedC
              ? content
              : msg.embeds.length !== 0
                ? null : null,
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

          if (msg.reactions.size > 0) msg.reactions.removeAll();

          return msg.edit(embedC ? '' : content, options) // If content === object, send (text) nothing. Else, send the content
            .then(m => { return resolve(m); })
            .catch(e => { return reject(e); });
        })
        .catch(e => {
          if (e.message === 'Unknown Message') {
            message.channel.send(owoify(), options ? options : null)
              .then(msg => {
                client.msgCmdHistory[message.id] = msg.id;
                return resolve(msg);
              })
              .catch(e => { return reject(new Error(e)); });
          } else return reject(new Error(e));
        });

      function owoify() {
        // owo mode functionality
        if (message.guild && client.settings.get(message.guild.id)['owoMode'] === 'true') {
          if (content instanceof MessageEmbed) {
            const owoedEmbed = new MessageEmbed();

            // Stuff that's changed
            if (content.title) owoedEmbed.setTitle(owoedContent(content.title));
            if (content.description) owoedEmbed.setDescription(owoedContent(content.description));
            if (content.author) owoedEmbed.setAuthor(owoedContent(content.author.name), content.author.iconURL ? content.author.iconURL : undefined, content.author.url ? content.author.url : undefined);
            if (content.footer) owoedEmbed.setFooter(owoedContent(content.footer.text));
            if (content.fields) for (const field of content.fields) { owoedEmbed.addField(field.name, owoedContent(field.value), field.inline); }

            // Stuff that's not changed, but still needs to be transferred over
            if (content.color) owoedEmbed.setColor(content.color);
            if (content.url) owoedEmbed.setURL(content.url);
            if (content.timestamp) owoedEmbed.setTimestamp(content.timestamp);
            if (content.files.length !== 0) owoedEmbed.attachFiles(content.files); // MessageEmbed.files is an array

            return owoedEmbed;
          }

          return owoedContent(content);
        } else return content;

        function owoedContent(str) {
          str = str.replace(/r/g, 'w').replace(/l/g, 'w').replace(/R/g, 'W').replace(/L/g, 'W');
          const ous = ['o', 'O', '0', 'u', 'U'];
          const ws = ['w', 'W'];

          return str += ` ${[`${ous.randomElement()}${ws.randomElement()}${ous.randomElement()}`, ':3c'].randomElement()}`;
        }
      }

      // Checks if msgCmdHistory (Set) has the id of the message. If not, it sends a new message.
      // This is placed after the initial edit statement because it will send a message regardless.
      if (!client.msgCmdHistory.has(message.id)) {
        if (options) return message.channel.send(owoify(), options).then(msg => {
          client.msgCmdHistory[message.id] = msg.id;
          return resolve(msg);
        }).catch(e => { return reject(new Error(e)); });
        else return message.channel.send(owoify()).then(msg => {
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
        let role = message.guild.roles.cache.get(data);
        if (role === undefined) {
          role = message.guild.roles.cache.find(r => r.name.toLowerCase().includes(data.toLowerCase()));
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
      if (data instanceof User) return data;
      if (message.mentions.users.size === 0) {
        let user = client.users.cache.get(data);
        if (user === undefined) {
          user = client.users.cache.find(r => (r.username.toLowerCase().includes(data.toLowerCase()) || r.tag.toLowerCase() === data.toLowerCase()));
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
      if (data instanceof GuildMember) return data;
      if (message.mentions.members.size === 0) {
        let member = message.guild.members.cache.get(data);
        if (member === undefined) {
          member = message.guild.members.cache.find(r => (r.user.username.toLowerCase().includes(data.toLowerCase()) || r.user.tag.toLowerCase() === data.toLowerCase()));
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
        const channel = message.guild.channels.cache.get(data.substring(2, data.length - 1));
        if (!channel) throw new Error('Channel does not exist');
        return channel;
      }
      else if (data.startsWith('#')) { // data === #channel
        data = data.substring(1);
        const channel = message.guild.channels.cache.find(g => g.name.includes(data));
        if (!channel) throw new Error('Channel does not exist');
        return channel;
      }
      else { // data === ID
        const channel = message.guild.channels.cache.get(data);
        if (!channel) throw new Error('Channel does not exist');
        return channel;
      }
    }
  };
};