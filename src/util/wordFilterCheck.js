module.exports = (client, message, staffBypassesLimits) => {
  const wordFilterEnabled = message.guild
    ? client.settings.get(message.guild.id)['wordFilter'] === 'true' ? true : false
    : client.config.defaultSettings['wordFilter'] === 'true' ? true : false;

  const deleteWordOnDetect = message.guild
    ? client.settings.get(message.guild.id)['filterDelete'] === 'true' ? true : false
    : client.config.defaultSettings['filterDelete'] === 'true' ? true : false;

  const filterAggressionLevel = message.guild
    ? client.settings.get(message.guild.id)['filterAggressionLevel']
    : client.config.defaultSettings['filterAggressionLevel'];

  let filterTriggered = false;

  switch (+filterAggressionLevel) {
    case 1: { // Low - Checks for just the word
      // See mdn Array.some() for more info on how this works.
      // message.guild.wordFilter is an array
      const messageContainsWordInFilter = message.guild.wordFilter.some(word => message.content.toLowerCase().includes(word));
      if (messageContainsWordInFilter) filterTriggered = true;
      break;
    }
    case 2: { // Medium - Removes repeated characters and checks for the word
      const repeatedCharacterPreSortArray = message.content.toLowerCase()
        .split('') // => Array
        .sort() // => Sorted array
        .join('') // => String
        .match(/(.)\1+/g); // => Array of matches

      let repeatedCharacter = null;
      // This check exists because a message may contain no repeating characters
      if (repeatedCharacterPreSortArray) repeatedCharacter = repeatedCharacterPreSortArray.sort((a, b) => { // => Sorted array based on length
        return a.length < b.length ? 1 : -1;
      })[0][0]; // => The first character of the first element of the matches;

      if (!repeatedCharacter) { // Even if there's no repeated character, check anyway.
        const messageContainsWordInFilter = message.guild.wordFilter.some(word => message.content.toLowerCase().includes(word));
        if (messageContainsWordInFilter) filterTriggered = true;
        break;
      }

      const contentWithOneTimeRepeatingCharacterRemoved = message.content.replace(new RegExp(repeatedCharacter, 'g'), '');
      const contentWithOneTimeRepeatingCharacterRemovedContainsWordInFilter =
        message.guild.wordFilter.some(word => contentWithOneTimeRepeatingCharacterRemoved.toLowerCase().includes(word));

      if (contentWithOneTimeRepeatingCharacterRemovedContainsWordInFilter) filterTriggered = true;
      break;
    }
    case 3: { // High - Level 2 + replaces commonly used l33t sp34k characters with their "english" equivalent
      const contentReplaced = message.content.toLowerCase()
        .replace(/3/g, 'e')
        .replace(/4/g, 'a')
        .replace(/5/g, 's')
        .replace(/6/g, 'g')
        .replace(/7/g, 't')
        .replace(/0/g, 'o')
        .replace(/\$/g, 's')
        .replace(/!/g, 'i')
        .replace(/\+/g, 't');

      const repeatedCharacterPreSortArray = contentReplaced.toLowerCase()
        .split('') // => Array
        .sort() // => Sorted array
        .join('') // => String
        .match(/(.)\1+/g); // => Array of matches

      let repeatedCharacter = null;
      // This check exists because a message may contain no repeating characters
      if (repeatedCharacterPreSortArray) repeatedCharacter = repeatedCharacterPreSortArray.sort((a, b) => { // => Sorted array based on length
        return a.length < b.length ? 1 : -1;
      })[0][0]; // => The first character of the first element of the matches;

      if (!repeatedCharacter) { // Even if there's no repeated character, check anyway.
        const messageContainsWordInFilter = message.guild.wordFilter.some(word => contentReplaced.toLowerCase().includes(word));
        if (messageContainsWordInFilter) filterTriggered = true;
        break;
      }

      const contentWithOneTimeRepeatingCharacterRemoved = contentReplaced.replace(new RegExp(repeatedCharacter, 'g'), '');
      const contentWithOneTimeRepeatingCharacterRemovedContainsWordInFilter =
        message.guild.wordFilter.some(word => contentWithOneTimeRepeatingCharacterRemoved.toLowerCase().includes(word));

      if (contentWithOneTimeRepeatingCharacterRemovedContainsWordInFilter) filterTriggered = true;
      break;
    }
  }

  if (wordFilterEnabled && filterTriggered) {
    if (client.permlevel(message.member) > 1) {
      if (staffBypassesLimits);
      else {
        message.channel.send(`:warning: \`|\` 📃 ${message.author.toString()}, **your message contained a word in the word filter.**`);
        if (deleteWordOnDetect) message.delete();
      }
    } else {
      message.channel.send(`:warning: \`|\` 📃 ${message.author.toString()}, **your message contained a word in the word filter.**`);
      if (deleteWordOnDetect) message.delete();
    }
  }
};