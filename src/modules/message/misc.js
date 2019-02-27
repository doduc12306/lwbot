module.exports = async (client, message) => {

  // Message send function, pretty much extends message.channel.send/message.edit in that it allows the user to edit their command message and it runs that instead
  message.send = (content, options) => {
    return new Promise((resolve, reject) => {
      if(!content) return reject(new Error('Cannot send an empty message'));

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

          if(msg.reactions.size > 0) msg.clearReactions();

          return resolve(msg.edit(embedC ? '' : content, options)); // If content === object, send (text) nothing. Else, send the content
        })
        .catch(e => {
          if (e.message === 'Unknown Message') {
            message.channel.send(content, options ? options : null).then(msg => {
              client.msgCmdHistory[message.id] = msg.id;
              return resolve(msg);
            });
          } else return reject(new Error(e));
        });

      if(!client.msgCmdHistory.has(message.id)) {
        if (options) return message.channel.send(content, options).then(msg => {
          client.msgCmdHistory[message.id] = msg.id;
          return resolve(msg);
        });
        else return message.channel.send(content).then(msg => {
          client.msgCmdHistory[message.id] = msg.id;
          return resolve(msg);
        });
      }
    });
  };

  // Other various functions
  message.functions = {
    parseRole: data => {
      if (message.channel.type !== 'text') throw new Error('I can\'t find a role if I\'m not in a guild!');
      if(!data) throw new Error('You didn\'t give me anything to find a role from!');
      if(message.mentions.roles.size === 0) {
        let role = message.guild.roles.get(data);
        if(role === undefined) {
          role = message.guild.roles.find(r => r.name.toLowerCase().includes(data.toLowerCase()));
          if(!role) throw new Error('I couldn\'t find that role! ');
          else return role;
        } else return role;
      } else {
        const role = message.mentions.roles.first();
        return role;
      }
    },
    parseUser: data => {
      if(!data) throw new Error('You didn\'t give me anything to find a user from!');
      if(message.mentions.users.size === 0) {
        let user = client.users.get(data);
        if(user === undefined) {
          user = client.users.find(r => (r.username.toLowerCase().includes(data.toLowerCase()) || r.tag.toLowerCase() === data.toLowerCase()));
          if(!user) throw new Error('I couldn\'t find that user!');
          else return user;
        } else return user;
      } else {
        const user = message.mentions.users.first();
        return user;
      }
    },
    parseMember: data => {
      if (message.channel.type !== 'text') throw new Error('I can\'t find a member if I\'m not in a guild!');
      if (!data) throw new Error('You didn\'t give me anything to find a member from!');
      if(message.mentions.members.size === 0) {
        let member = message.guild.members.get(data);
        if(member === undefined) {
          member = message.guild.members.find(r => (r.user.username.toLowerCase().includes(data.toLowerCase()) || r.user.tag.toLowerCase() === data.toLowerCase()));
          if (!member) throw new Error('I couldn\'t find that member!');
          else return member;
        } else return member;
      } else {
        const member = message.mentions.members.first();
        return member;
      }
    },
    parseChannel: data => {
      if (message.channel.type !== 'text') throw new Error('I can\'t find a channel if I\'m not in a guild!');
      if (!data) throw new Error('You didn\'t give me anything to find a channel from!');
      if(message.mentions.channels.size === 0) {
        let channel = message.guild.channels.get(data);
        if(channel === undefined) {
          if(data.startsWith('#')) data = data.split('#')[1];
          channel = message.guild.channels.find(r => r.name.includes(data));
          if (!channel) throw new Error('I couldn\'t find that channel!');
          else return channel;
        } else return channel;
      } else {
        const channel = message.mentions.channels.first();
        return channel;
      }
    }
  };
};