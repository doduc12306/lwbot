const fetch = require('node-fetch');
module.exports = {
  run: (client, message, args) => {
    let query = args.join(' ');

    if (!query) return message.send('❌ `|` 💡 **Missing something to query!**');

    let metricMode = false;
    if(query.endsWith('--metric')) { query = query.split('--metric')[0]; metricMode = true; }

    message.send('<a:loading:536942274643361794> `|` 💡 **Loading...**').then(msg => {
      query = encodeURIComponent(query);

      fetch(`http://api.wolframalpha.com/v1/result?appid=${process.env.WOLFRAM}&i=${query}${metricMode ? '&units=metric' : ''}`)
        .then(async res => {
          if (res.status === 501) return msg.edit('❌ `|` 💡 **I don\'t understand, try asking another question.**');

          const response = await res.text();
          msg.edit(`💡 **\`${response}\`**`);
        });
    });
  },

  conf: {
    enabled: true,
    permLevel: 'User',
    aliases: ['wolframalpha', 'ask'],
    guildOnly: false,
    failoverDisabled: true
  },

  help: {
    name: 'wolfram',
    description: 'Ask Wolfram Alpha a question',
    usage: 'wolfram <query> [--metric]',
    category: 'Misc'
  }
};

// This is the first file I've set up in object format like this.
// Theoretically, it should work. Let's see if it does. | It does \o/