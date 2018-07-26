module.exports.run = (client, message, args) => {
  try {

    
    if(args[0] === 'play'){
      
      // Create a database or something, then add the user/channel to it. Go from there, you're smart. You should know how to do this. At the time of writing this, it's 00:47. My brain is too tired to handle this. Maybe caffinated you can. Good luck.

    } else if(args[0] === 'help'){
      message.channel.send('**SHIRITORI**\n\nA Japanese game in that the last few letters (1-3) of the last word posted must be the beginning few letters of the next word.\n\nFor example:\n> Hel**lo**\n> **Lo**at**he**\n> **He**a**th**\n> **Th**ermomet**er**\n> **Er**ror\netc until the last person standing wins the round.');
    } else return message.channel.send(':x: **That isn\'t an option!**');
  } catch (e) {
    message.channel.send(`**ERROR**: ${e.stack}`);
  }
};

exports.conf = {
  enabled: true,
  aliases: [],
  guildOnly: true,
  permLevel: 'User'
};

exports.help = {
  name: 'shiritori',
  description: 'A word game: the ending of one word is the beginning of the next. If you\'re still confused, google it.',
  usage: 'shiritori <play/help/join>',
  category: 'Fun'
};