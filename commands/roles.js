module.exports.run = (client, message, args) => {
  var type = args[0];
  if(!type) {
    message.delete();
    return message.author.send(':x: Either \`genre\`, \`ping\`, or \`misc\` role menus please.');
  }
  if(!['genre', 'ping', 'misc'].includes(type)) {
    message.delete();
    return message.author.send(':x: Either \`genre\`, \`ping\`, or \`misc\` role menus please.');
  }

  if(type === "genre"){
    message.channel.send(':crossed_swords: : `Fantasy / Action`\n\n:muscle: : \`Superhero\`\n\n:heart: : \`Romance / Drama\`\n\n:ghost: : \`Thriller / Horror\`\n\n:basketball: : \`Sports\`\n\n:notebook_with_decorative_cover: : \`Slice of Life\`\n\n:rofl: : \`Comedy\`')
    .then(async msg => {

      await msg.react('⚔');
      await msg.react('💪');
      await msg.react('❤');
      await msg.react('👻');
      await msg.react('🏀');
      await msg.react('📔');
      await msg.react('🤣');

      const collector = msg.createReactionCollector((reaction, user) => 
        reaction.emoji.name === "⚔" ||
        reaction.emoji.name === "💪" ||
        reaction.emoji.name === "❤" ||
        reaction.emoji.name === "👻" || 
        reaction.emoji.name === "🏀" || 
        reaction.emoji.name === "📔" ||
        reaction.emoji.name === "🤣"
      )
      collector.on("collect", reaction => {
        const chosen = reaction.emoji.name;
        var member = reaction.users.last().id
        member = message.guild.members.get(member);

        function toggleRole(role) {
          if(!member.roles.has(role)) member.addRole(role);
          else member.removeRole(role);
        }

        if(chosen === "⚔") {
          toggleRole('444346550760636417');
        } else if(chosen === "💪") {
          toggleRole('444396478446829568');
        } else if(chosen === "❤") {
          toggleRole('444346546142838784');
        } else if(chosen === "👻") {
          toggleRole('444346749390159872');
        } else if(chosen === "🏀"){
          toggleRole('444346752976551936');
        } else if(chosen === "📔") {
          toggleRole('444346756159766536');
        } else if(chosen === "🤣") {
          toggleRole('444347123769802754');
        }
      }); 
    });
  }

  if(type === "ping"){
    message.channel.send(':pushpin: : \`PING ME\` - Let\'s you know when announcements are given.\n\n:popcorn: : \`Movie Night\` - Will be used to ping individuals interested in move night.\n\n:joystick: : \`Game Night\` - Will alert you when a game night is being planned/taking place.\n\n:microphone: : \`Karaoke Night\` - Will alert you when a karaoke competition or event is taking place!\n\n:heart_eyes: : \`Anime Night\` - Be pinged when an anime movie or show is being streamed in <#458439405690945537>\n\n:handshake: : \`Partnerships\` - Will let you know when we get partnered with a new server!\n\n:writing_hand: : \`Writers\` - Will be pinged for the writing events.\n\n:art: : \`Artists\` - Will be pinged for the art events.\n\n:purple_heart: : \`Therapist\` - This role is for individuals interested in being pinged when someone needs advice/someone to talk to in the <#459950523664171008> channel.\n\n:pencil: : \`Tutor\` - This role is for individuals interested in being pinged when someone needs help on their homework in <#453078140886188032>')
      .then(async msg => {
        
        await msg.react('📌');
        await msg.react('🍿');
        await msg.react('🕹');
        await msg.react('🎤');
        await msg.react('😍');
        await msg.react('🤝');
        await msg.react('✍');
        await msg.react('🎨');
        await msg.react('💜');
        await msg.react('📝');
        
        const collector = msg.createReactionCollector((reaction, user) => 
        reaction.emoji.name === "📌" ||
        reaction.emoji.name === "🍿" ||
        reaction.emoji.name === "🕹" ||
        reaction.emoji.name === "🎤" || 
        reaction.emoji.name === "😍" || 
        reaction.emoji.name === "🤝" ||
        reaction.emoji.name === "✍" ||
        reaction.emoji.name === "🎨" || 
        reaction.emoji.name === "💜" || 
        reaction.emoji.name === "📝"
      )
      collector.on("collect", reaction => {
        const chosen = reaction.emoji.name;
        var member = reaction.users.last().id
        member = message.guild.members.get(member);

        function toggleRole(role) {
          if(!member.roles.has(role)) member.addRole(role);
          else member.removeRole(role);
        }

        if(chosen === "📌") {
          toggleRole('432633011515949067');
        } else if(chosen === "🍿") {
          toggleRole('440974703062941696');
        } else if(chosen === "🕹") {
          toggleRole('440974647975215125');
        } else if(chosen === "🎤") {
          toggleRole('455182908551069697');
        } else if(chosen === "😍"){
          toggleRole('458434931899498518');
        } else if(chosen === "🤝") {
          toggleRole('440974803940278293');
        } else if(chosen === "✍") {
          toggleRole('458436541694607361');
        } else if(chosen === "🎨"){
          toggleRole('458436569662226442');
        } else if(chosen === "💜"){
          toggleRole('442896867307683842');
        } else if(chosen === "📝"){
          toggleRole('453294003002015744');
        }
      }); 
    });
  }
  if(type === 'misc') {
    message.channel.send(':envelope_with_arrow: : \`Open DM\`\n\n:no_entry_sign: : \`Closed DM\`\n\n:question: : \`Ask to DM\`\n\n:computer: : \`PC Master Race\`\n\n:video_game: : \`Playstation\`\n\n:green_heart: : \`Xbox\`\n\n:v: : \`Nintendo\`\n\n:movie_camera: : \`Youtuber\`\n\n:eye: : \`Streamer\`\n\n**DIVIDERS**\n\n:notebook: : \`OTHER TITLES divider\`\n\n:blue_book: : \`LEVELS divider\`\n\n:closed_book: : \`PINGS divider\`\n\n:green_book: : \`GENRE divider\`\n\n:orange_book: : \`MISC divider\`')
      .then(async msg => {
        
        await msg.react('📩');
        await msg.react('🚫');
        await msg.react('❓');
        await msg.react('💻');
        await msg.react('🎮');
        await msg.react('💚');
        await msg.react('✌');
        await msg.react('🎥');
        await msg.react('👁');
        await msg.react('📓');
        await msg.react('📘');
        await msg.react('📕');
        await msg.react('📗');
        await msg.react('📙');
        
        const collector = msg.createReactionCollector((reaction, user) => 
        reaction.emoji.name === "📩" ||
        reaction.emoji.name === "⛔️" ||
        reaction.emoji.name === "❓" ||
        reaction.emoji.name === "💻" || 
        reaction.emoji.name === "🎮" || 
        reaction.emoji.name === "💚" ||
        reaction.emoji.name === "✌️" ||
        reaction.emoji.name === "🎥" || 
        reaction.emoji.name === "👁" || 
        reaction.emoji.name === "📓" || 
        reaction.emoji.name === "📘" || 
        reaction.emoji.name === "📕" || 
        reaction.emoji.name === "📗" || 
        reaction.emoji.name === "📙"
      )
      collector.on("collect", reaction => {
        const chosen = reaction.emoji.name;
        var member = reaction.users.last().id
        member = message.guild.members.get(member);

        function toggleRole(role) {
          if(!member.roles.has(role)) member.addRole(role);
          else member.removeRole(role);
        }

        if(chosen === "📩") {
          toggleRole('444347837560520704');
        } else if(chosen === "⛔️") {
          toggleRole('444347835060846612');
        } else if(chosen === "❓") {
          toggleRole('444347831864524800');
        } else if(chosen === "💻") {
          toggleRole('444347838235672596');
        } else if(chosen === "🎮"){
          toggleRole('444347839091572736');
        } else if(chosen === "💚") {
          toggleRole('444348193568718849');
        } else if(chosen === "✌️") {
          toggleRole('444348188975955969');
        } else if(chosen === "🎥"){
          toggleRole('444348190771380226');
        } else if(chosen === "👁"){
          toggleRole('444390328158650388');
        } else if(chosen === "📓"){
          toggleRole('444340936286273538');
        } else if(chosen === "📘"){
          toggleRole('444291891899662346');
        } else if(chosen === "📕"){
          toggleRole('444291781031493633');
        } else if(chosen === "📗"){
          toggleRole('444346408670330890');
        } else if(chosen === "📙"){
          toggleRole('444340936286273538');
        }
      }); 
    });
  }
};

exports.conf = {
  enabled: true,
  aliases: [],
  guildOnly: false,
  permLevel: 'Administrator'
};

exports.help = {
  name: 'roles',
  description: 'The role menus for <#444375693728546816>, <#440974386544115713>, and <#444375656139063296>. On the slim chance (/s) that they stop working, run this command.',
  category: 'Server',
  usage: 'roles <genre/ping/misc>'
};