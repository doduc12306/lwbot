var google = require('google');

module.exports.run = (client, message, args) => {
  try {
    var query = args.slice(0).join(' ');

  if (!query) return message.channel.send(':x: \`|\` 🔍 **You didn\'t say something to google!**');

  google.resultsPerPage = 1;
  google(query, function (err, res){
    if (err) {
      message.channel.send(':x: \`|\` 🔍 **There was an error during the search process. Please try again later.**');
      return console.error(err);
    }
    var link = res.links[0];

    var response = `🔍 **\`${link.title}\`** - ${link.href}`;

    message.channel.send(response).catch(e => {
      message.channel.send(':x: \`|\` 🔍 **There was an error during the search process. Please try again later.**');
      console.log(`Catch error: ${e}`);
    });
  });
} catch (e) {
    message.channel.send(':x: \`|\` 🔍 **There was an error during the search process. Please try again later.**');
    console.log(`Try-catch error: ${e}`);
}
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User'
};

exports.help = {
  name: 'google',
  description: 'Google something',
  usage: 'google <query>',
  category: 'Misc'
};