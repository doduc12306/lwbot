module.exports = async (client, packet) => {
  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
  packet = packet.d;

  var genreChannel = client.channels.get('444375693728546816');
  var pingChannel = client.channels.get('440974386544115713');
  var miscChannel = client.channels.get('444375656139063296');

  var guild = client.guilds.get(packet.guild_id);
  var member = guild.members.get(packet.user_id);
  function toggleRole(role) {
    if (!member.roles.has(role)) member.addRole(role);
    else member.removeRole(role);
  }

  if(packet.channel_id === genreChannel.id) {
    switch(packet.emoji.name) {
      case "⚔":
        toggleRole('444346550760636417');
        break;
      case "💪":
        toggleRole('444396478446829568');
        break;
      case "❤":
        toggleRole('444346546142838784');
        break;
      case "👻":
        toggleRole('444346749390159872');
        break;
      case "🏀":
        toggleRole('444346752976551936');
        break;
      case "📔":
        toggleRole('444346756159766536');
        break;
      case "🤣":
        toggleRole('444347123769802754');
        break;
    }
  }

  if(packet.channel_id === pingChannel.id) {
    switch (packet.emoji.name) {
      case "📌":
        toggleRole('432633011515949067');
        break;
      case "🍿":
        toggleRole('440974703062941696');
        break;
      case "🕹":
        toggleRole('440974647975215125');
        break;
      case "🎤":
        toggleRole('455182908551069697');
        break;
      case "😍":
        toggleRole('458434931899498518');
        break;
      case "✍":
        toggleRole('458436541694607361');
        break;
      case "🎨":
        toggleRole('458436569662226442');
        break;
      case "💜":
        toggleRole('442896867307683842');
        break;
      case "📝":
        toggleRole('453294003002015744');
        break;
    }
  }

  if(packet.channel_id === miscChannel.id) {
    switch (packet.emoji.name) {
      case "📩":
        toggleRole('444347837560520704');
        break;
      case "⛔️":
        toggleRole('444347835060846612');
        break;
      case "❓":
        toggleRole('444347831864524800');
        break;
      case "💻":
        toggleRole('444347838235672596');
        break;
      case "🎮":
        toggleRole('444347839091572736');
        break;
      case "💚":
        toggleRole('444348193568718849');
        break;
      case "✌️":
        toggleRole('444348188975955969');
        break;
      case "🎥":
        toggleRole('444348190771380226');
        break;
      case "👁":
        toggleRole('444390328158650388');
        break;
      case "📓":
        toggleRole('444340936286273538');
        break;
      case "📘":
        toggleRole('444291891899662346');
        break;
      case "📕":
        toggleRole('444291781031493633');
        break;
      case "📗":
        toggleRole('444346408670330890');
        break;
      case "📙":
        toggleRole('444340936286273538');
        break;
    }
  }
};