/* eslint-disable */
module.exports.run = async (client, message, args) => {
  var slot = [':monkey:', ':frog:', ':elephant:', ':snail:', ':bee:',':star:', ':fox:', ':crown:', ':four_leaf_clover:', ':lemon:', ':cherries:', ':melon:', ':grapes:', ':bomb:', ':unicorn:', ':zap:', '<a:parrotHD:397047432640331777>', ':pear:', ':banana:', ':tangerine:', ':watermelon:', ':gem:'];

  var specialGood = [':four_leaf_clover:', ':star:', '<a:parrotHD:397047432640331777>', ':gem:'];
  var specialBad = [':bomb:'];

  Array.prototype.randomElement = function(array) {
    return array[Math.floor(Math.random() * array.length)];
  };

  try {
    if (!args[0]) {

      var fslot1 = await slot.randomElement(slot);
      var fslot2 = await slot.randomElement(slot);
      var fslot3 = await slot.randomElement(slot);
      var fslot4 = await slot.randomElement(slot);
      var fslot5 = await slot.randomElement(slot);
      var fslot6 = await slot.randomElement(slot);
      var fslot7 = await slot.randomElement(slot);
      var fslot8 = await slot.randomElement(slot);
      var fslot9 = await slot.randomElement(slot);

      if (fslot4 === fslot5 && fslot5 === fslot6 && fslot6 === fslot4) {
        message.channel.send(`${fslot1}  **|**  ${fslot2} **|**  ${fslot3}\n\n${fslot4}  **|**  ${fslot5}  **|**  ${fslot6}   **<**\n\n${fslot7}  **|**  ${fslot8}  **|**  ${fslot9}\n\n         **[ Yup ]**`);
      } else {
        message.channel.send(`${fslot1}  **|**  ${fslot2} **|**  ${fslot3}\n\n${fslot4}  **|**  ${fslot5}  **|**  ${fslot6}   **<**\n\n${fslot7}  **|**  ${fslot8}  **|**  ${fslot9}\n\n         **[ Nope ]**`);
      }
    } else if (args[0] === '%') {
      message.channel.send(`:slot_machine: The current win percentage is **${Math.round(((1/slot.length)*3)*100)}%**\n:gear: **\`Rounded: ((1 ÷ Length of slot array) x 3) x 100\`**`);
    } else if (args[0] === 'list') {
      message.channel.send(`Current emotes: ${slot}`);
    }
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
  usage: 'slots [% | list]',
  category: 'Economy'
};