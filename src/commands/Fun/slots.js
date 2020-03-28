/* eslint-disable */
module.exports.run = (client, message, args) => {
  const bet = args[0];
  if(!bet) return message.send('❌ `|` :slot_machine: **You\'re missing how much would you like to bet!**');
  if(typeof bet !== 'string') return message.send(`❌ \`|\` :slot_machine: **"${bet}" is not a number!**`);

  const availableSlots = [':heart:', ':monkey:', ':frog:', ':elephant:', ':snail:', ':bee:', ':star:', ':fox:', ':crown:', ':four_leaf_clover:', ':lemon:', ':cherries:', ':melon:', ':grapes:', ':bomb:', ':unicorn:', ':zap:', ':pear:', ':banana:', ':tangerine:', ':watermelon:', ':gem:', ':seven:', ':100:', ':gun:', ':knife:', ':skull_crossbones:', ':broken_heart:', ':beetle:', ':crab:', ':peach:', ':eggplant:', ':strawberry:'];

  const generatedSlots = [];
  for (let i = 0; i < 9; i++) {
    const randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
    generatedSlots.push(randomSlot);
  }

  // generatedSlots[0] | generatedSlots[1] | generatedSlots[2]
  // generatedSlots[3] | generatedSlots[4] | generatedSlots[5]
  // generatedSlots[6] | generatedSlots[7] | generatedSlots[8]

  // Unicode characters:
  // * \u2304 - ⌄
  // * \u2303 - ⌃
  // * \u2009 - Half width space

  message.send(`
**\`[ 🎰 S L O T S 🎰 ]\`**
\`|\`  ${generatedSlots[0]}   **|**   ${generatedSlots[1]}   **|**   ${generatedSlots[2]}   \`|\`
\`|\`   \u2009**\u2304**           \u2009**\u2304**           **\u2304**     \`|\`
\`|\`  ${generatedSlots[3]}   **|**   ${generatedSlots[4]}   **|**   ${generatedSlots[5]}   \`|\`
\`|\`   \u2009**\u2303**           \u2009**\u2303**           **\u2303**     \`|\`
\`|\`  ${generatedSlots[6]}   **|**   ${generatedSlots[7]}   **|**   ${generatedSlots[8]}   \`|\`
\`[\u2009 : : : : : : : : ]\`
`).then(async msg => {
    // Give the illusion of each slot moving down one
    generatedSlots[6] = generatedSlots[3]; //
    generatedSlots[7] = generatedSlots[4]; // Middle row -> bottom row
    generatedSlots[8] = generatedSlots[5]; //

    generatedSlots[3] = generatedSlots[0]; //
    generatedSlots[4] = generatedSlots[1]; // Top row -> middle row
    generatedSlots[5] = generatedSlots[2]; //

    generatedSlots[0] = availableSlots[Math.floor(Math.random() * availableSlots.length)]; // 
    generatedSlots[1] = availableSlots[Math.floor(Math.random() * availableSlots.length)]; // New top row
    generatedSlots[2] = availableSlots[Math.floor(Math.random() * availableSlots.length)]; //

    await client.wait(500);

    return msg.edit(`
**\`[ 🎰 S L O T S 🎰 ]\`**
\`|\`  ${generatedSlots[0]}   **|**   ${generatedSlots[1]}   **|**   ${generatedSlots[2]}   \`|\`
\`|\`   \u2009**\u2304**           \u2009**\u2304**           **\u2304**     \`|\`
\`|\`  ${generatedSlots[3]}   **|**   ${generatedSlots[4]}   **|**   ${generatedSlots[5]}   \`|\`
\`|\`   \u2009**\u2303**           \u2009**\u2303**           **\u2303**     \`|\`
\`|\`  ${generatedSlots[6]}   **|**   ${generatedSlots[7]}   **|**   ${generatedSlots[8]}   \`|\`
\`[\u2009 : : : : : : : : ]\`
`);
  }).then(async msg => {
    // Again...

    // Give the illusion of each slot moving down one
    generatedSlots[6] = generatedSlots[3]; //
    generatedSlots[7] = generatedSlots[4]; // Middle row -> bottom row
    generatedSlots[8] = generatedSlots[5]; //

    generatedSlots[3] = generatedSlots[0]; //
    generatedSlots[4] = generatedSlots[1]; // Top row -> middle row
    generatedSlots[5] = generatedSlots[2]; //

    generatedSlots[0] = availableSlots[Math.floor(Math.random() * availableSlots.length)]; // 
    generatedSlots[1] = availableSlots[Math.floor(Math.random() * availableSlots.length)]; // New top row
    generatedSlots[2] = availableSlots[Math.floor(Math.random() * availableSlots.length)]; //

    await client.wait(650);

    return msg.edit(`
**\`[ 🎰 S L O T S 🎰 ]\`**
\`|\`  ${generatedSlots[0]}   **|**   ${generatedSlots[1]}   **|**   ${generatedSlots[2]}   \`|\`
\`|\`   \u2009**\u2304**           \u2009**\u2304**           **\u2304**     \`|\`
\`|\`  ${generatedSlots[3]}   **|**   ${generatedSlots[4]}   **|**   ${generatedSlots[5]}   \`|\`
\`|\`   \u2009**\u2303**           \u2009**\u2303**           **\u2303**     \`|\`
\`|\`  ${generatedSlots[6]}   **|**   ${generatedSlots[7]}   **|**   ${generatedSlots[8]}   \`|\`
\`[\u2009 : : : : : : : : ]\`
`);
  }).then(async msg => {
    // Last time!

    // Give the illusion of each slot moving down one
    generatedSlots[6] = generatedSlots[3]; //
    generatedSlots[7] = generatedSlots[4]; // Middle row -> bottom row
    generatedSlots[8] = generatedSlots[5]; //

    generatedSlots[3] = generatedSlots[0]; //
    generatedSlots[4] = generatedSlots[1]; // Top row -> middle row
    generatedSlots[5] = generatedSlots[2]; //

    generatedSlots[0] = availableSlots[Math.floor(Math.random() * availableSlots.length)]; // 
    generatedSlots[1] = availableSlots[Math.floor(Math.random() * availableSlots.length)]; // New top row
    generatedSlots[2] = availableSlots[Math.floor(Math.random() * availableSlots.length)]; //

    await client.wait(1000);

    return msg.edit(`
**\`[ 🎰 S L O T S 🎰 ]\`**
\`|\`  ${generatedSlots[0]}   **|**   ${generatedSlots[1]}   **|**   ${generatedSlots[2]}   \`|\`
\`|\`   \u2009**\u2304**           \u2009**\u2304**           **\u2304**     \`|\`
\`|\`  ${generatedSlots[3]}   **|**   ${generatedSlots[4]}   **|**   ${generatedSlots[5]}   \`|\`
\`|\`   \u2009**\u2303**           \u2009**\u2303**           **\u2303**     \`|\`
\`|\`  ${generatedSlots[6]}   **|**   ${generatedSlots[7]}   **|**   ${generatedSlots[8]}   \`|\`
\`[\u2009 : : : : : : : : ]\`
`);
  }).then(msg => {
    // End the sequence, tell if the user won or not.

    const messageToSend = `
**\`[ 🎰 S L O T S 🎰 ]\`**
\`|\`  ${generatedSlots[0]}   **|**   ${generatedSlots[1]}   **|**   ${generatedSlots[2]}   \`|\`
\`|\`   \u2009**\u2304**           \u2009**\u2304**           **\u2304**     \`|\`
\`|\`  ${generatedSlots[3]}   **|**   ${generatedSlots[4]}   **|**   ${generatedSlots[5]}   \`|\`
\`|\`   \u2009**\u2303**           \u2009**\u2303**           **\u2303**     \`|\`
\`|\`  ${generatedSlots[6]}   **|**   ${generatedSlots[7]}   **|**   ${generatedSlots[8]}   \`|\`
`;

    const total = calculateMultiplier(bet, generatedSlots[3], generatedSlots[4], generatedSlots[5]); // The three middle slots
    if(total === 1) return message.send(`user lost ${bet}`);
    else return message.send(`user made ${total}`);

    msg.edit(messageToSend);
  });

  function calculateMultiplier(initialBet, slot1, slot2, slot3) { /* eslint-disable-line no-inner-declarations */
    if(!initialBet) throw new Error('"initialBet" parameter missing');

    let multiplier = 0;

    // Good slots
    if(slot1 === ':star:') multiplier = multiplier + 1.2;
    if(slot1 === ':four_leaf_clover') multiplier = multiplier + 2.4;
    if(slot1 === ':heart:') multiplier = multiplier + 3;
    if(slot1 === ':unicorn:') multiplier = multiplier + 4;
    if(slot1 === ':gem:') multiplier = multiplier + 5.5;
    if(slot1 === ':seven:') multiplier = multiplier + 6.3;
    if(slot1 === ':100:') multiplier = multiplier + 7.1;

    if(slot2 === ':star:') multiplier = multiplier + 0.2;
    if(slot2 === ':four_leaf_clover') multiplier = multiplier + 1.4;
    if(slot2 === ':heart:') multiplier = multiplier + 2;
    if(slot2 === ':unicorn:') multiplier = multiplier + 3;
    if(slot2 === ':gem:') multiplier = multiplier + 3.5;
    if(slot2 === ':seven:') multiplier = multiplier + 4.3;
    if(slot2 === ':100:') multiplier = multiplier + 5.1;

    if(slot3 === ':star:') multiplier = multiplier + 0.2;
    if(slot3 === ':four_leaf_clover') multiplier = multiplier + 1.4;
    if(slot3 === ':heart:') multiplier = multiplier + 2;
    if(slot3 === ':unicorn:') multiplier = multiplier + 3;
    if(slot3 === ':gem:') multiplier = multiplier + 3.5;
    if(slot3 === ':seven:') multiplier = multiplier + 4.3;
    if(slot3 === ':100:') multiplier = multiplier + 5.1;

    // Bad slots
    if(slot1 === ':knife:') multiplier = multiplier - 0.7;
    if(slot1 === ':gun:') multiplier = multiplier - 0.9;
    if(slot1 === ':broken_heart:') multiplier = multiplier - 0.9;
    if(slot1 === ':skull_crossbones:') multiplier = multiplier - 3;
    if(slot1 === ':bomb:') multiplier = multiplier - 5;

    if(slot2 === ':knife:') multiplier = multiplier - 0.7;
    if(slot2 === ':gun:') multiplier = multiplier - 0.9;
    if(slot2 === ':broken_heart:') multiplier = multiplier - 0.9;
    if(slot2 === ':skull_crossbones:') multiplier = multiplier - 3;
    if(slot2 === ':bomb:') multiplier = multiplier - 5;

    if(slot3 === ':knife:') multiplier = multiplier - 0.7;
    if(slot3 === ':gun:') multiplier = multiplier - 0.9;
    if(slot3 === ':broken_heart:') multiplier = multiplier - 0.9;
    if(slot3 === ':skull_crossbones:') multiplier = multiplier - 3;
    if(slot3 === ':bomb:') multiplier = multiplier - 5;

    if(multiplier <= 0) return 1;
    const final = (initialBet * (multiplier / 10) + initialBet);

    return final; // Like finding a tip, kind of.
  }
};

exports.conf = {
  enabled: false,
  guildOnly: false,
  aliases: ['slotmachine', 'slot'],
  permLevel: 'User',
  disabledReason: 'Multiplier is broken. Will fix in the next update'
};

exports.help = {
  name: 'slots',
  description: 'Slot machine',
  usage: 'slots',
  category: 'Fun'
};
