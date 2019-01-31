module.exports = async (client, packet) => {
  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
  if(client.config.debugMode) return;

  const genreChannel = client.channels.get('444375693728546816');
  const pingChannel = client.channels.get('440974386544115713');
  const miscChannel = client.channels.get('444375656139063296');

  const guild = client.guilds.get(packet.d.guild_id);
  const member = guild.members.get(packet.d.user_id);

  function toggleRole(role) {
    if (packet.t === 'MESSAGE_REACTION_ADD') member.addRole(role).then(() => client.verbose(`raw | Added role ${guild.roles.get(role).name} (${role}) to ${member.user.tag} (${member.user.id})`)).catch(e => client.verbose(e));
    if (packet.t === 'MESSAGE_REACTION_REMOVE') member.removeRole(role).then(() => client.verbose(`raw | Removed role ${guild.roles.get(role).name} (${role}) from ${member.user.tag} (${member.user.id})`)).catch(e => client.verbose(e));
  }

  if(packet.d.channel_id === genreChannel.id) {
    switch(packet.d.emoji.name) {
      case '⚔':
        toggleRole('444346550760636417');
        break;
      case '💪':
        toggleRole('444396478446829568');
        break;
      case '❤':
        toggleRole('444346546142838784');
        break;
      case '👻':
        toggleRole('444346749390159872');
        break;
      case '🏀':
        toggleRole('444346752976551936');
        break;
      case '📔':
        toggleRole('444346756159766536');
        break;
      case '🤣':
        toggleRole('444347123769802754');
        break;
      case '💥':
        toggleRole('527578436089413634');
        break;
    }
  }

  if(packet.d.channel_id === pingChannel.id) {
    switch (packet.d.emoji.name) {
      case '📌':
        toggleRole('432633011515949067');
        break;
      case '🍿':
        toggleRole('440974703062941696');
        break;
      case '🕹':
        toggleRole('440974647975215125');
        break;
      case '🎤':
        toggleRole('455182908551069697');
        break;
      case '😍':
        toggleRole('458434931899498518');
        break;
      case '✍':
        toggleRole('458436541694607361');
        break;
      case '🎨':
        toggleRole('458436569662226442');
        break;
      case '💜':
        toggleRole('442896867307683842');
        break;
      case '📝':
        toggleRole('453294003002015744');
        break;
      case '🤝':
        toggleRole('506247359316099082');
        break;
    }
  }

  if(packet.d.channel_id === miscChannel.id) {
    switch (packet.d.emoji.name) {
      case '📩':
        toggleRole('444347837560520704');
        break;
      case '⛔️':
        toggleRole('444347835060846612');
        break;
      case '❓':
        toggleRole('444347831864524800');
        break;
      case '💻':
        toggleRole('444347838235672596');
        break;
      case '🎮':
        toggleRole('444347839091572736');
        break;
      case '💚':
        toggleRole('444348193568718849');
        break;
      case '✌️':
        toggleRole('444348188975955969');
        break;
      case '🎥':
        toggleRole('444348190771380226');
        break;
      case '👁':
        toggleRole('444390328158650388');
        break;
      case '📓':
        toggleRole('444340936286273538');
        break;
      case '📘':
        toggleRole('444291891899662346');
        break;
      case '📕':
        toggleRole('444291781031493633');
        break;
      case '📗':
        toggleRole('444346408670330890');
        break;
      case '📙':
        toggleRole('444347691619844107');
        break;
    }
  }
};