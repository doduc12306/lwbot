module.exports.run = (client, message) => {
  var slot = [':monkey:', ':frog:', ':elephant:', ':snail:', ':bee:',':star:', ':fox:', ':crown:', ':four_leaf_clover:', ':lemon:', ':cherries:', ':melon:', ':grapes:', ':bomb:', ':unicorn:', ':zap:', '<a:parrotHD:397047432640331777>', ':pear:', ':banana:', ':tangerine:', ':watermelon:', ':gem:'];

  // var specialGood = [':four_leaf_clover:', ':star:', '<a:parrotHD:397047432640331777>', ':gem:'];
  // var specialBad = [':bomb:'];

  Array.prototype.randomElement = function(array) {
    return array[Math.floor(Math.random() * array.length)];
  };

  try {
    var slots = [];
    for (var i; i < 10; i++) {
      slots.push(slot.randomElement(slot));
    }

    // slots[0] | slots[1] | slots[2]
    // slots[3] | slots[4] | slots[5]
    // slots[6] | slots[7] | slots[8]

    if(slots[3] === slots[4] && slots[4] === slots[5] && slots[5] === slots[3]) message.channel.send('You win!');
    else message.channel.send('You lose!');
    // TODO: Change this ^ so that it's more styled.. actually show the slot items in the message
    // TODO: Include the specialGood and specialBad in the if statements
  } catch (err) {
    message.channel.send(`:x: ${err}`);
  }
};

exports.conf = {
  enabled: false,
  guildOnly: false,
  aliases: ['slotmachine', 'slot'],
  permLevel: 'User'
};

exports.help = {
  name: 'slots',
  description: 'Slot machine',
  usage: 'slots',
  category: 'Fun'
};
