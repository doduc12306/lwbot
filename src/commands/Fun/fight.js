const Fstrings = [' with a transformer.', ' with poutine.', ', and what a fight it is! Whoa mama!', ', with two thousand blades!', '. SHORYUKEN!', '. HADOUKEN!', '. KA-POW!', ' with a pillow.', ' with a large fish.', ' with a burnt piece of toast.'];

module.exports.run = (client, message) => {
  const user = message.mentions.users.first();

  const str = Fstrings.randomElement();

  if(!user) return message.channel.send(`${message.author} is fighting no one${str}`);
  if(user === message.author) return message.channel.send(`${user} is fighting themselves${str}`);
  if(user === client.user) return message.channel.send(`${user} is fighting me${str}`).then(msg => setTimeout(() => msg.edit(':trophy: **I WON!**'), 2000));

  message.channel.send(`${message.author} is fighting ${user}${str}`)
    .then(msg => {
      const n = Math.floor(Math.random()*2);
      setTimeout(() => {
        if(n === 0) return msg.edit(`:trophy: **${message.author} WON!**`);
        if(n === 1) return msg.edit(`:trophy: **${user} WON!**`);
      }, 2000);
    });

};

exports.conf = {
  enabled: true,
  aliases: ['fite'],
  permLevel: 'User',
  guildOnly: true
};

exports.help = {
  name: 'fight',
  description: 'Fight a user!',
  usage: 'fight <mention>',
  category: 'Fun'
};
