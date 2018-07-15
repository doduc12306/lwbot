const Sequelize = require(`sequelize`);
const Discord = require(`discord.js`);
const sequelize = new Sequelize(`database`, `user`, `password`, {
  host: `localhost`,
  dialect: `sqlite`,
  logging: false,
  // SQLite only
  storage: `database.sqlite`,
});
const Tags = sequelize.define(`tags`, {
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  description: Sequelize.TEXT,
  username: Sequelize.STRING,
  usage_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
});

module.exports = async client => {
  // Why await here? Because the ready event isn't actually ready, sometimes
  // guild information will come in *after* ready. 1s is plenty, generally,
  // for all of them to be loaded.
  await client.wait(1000);

  
  if(!client.config.debugMode) {
    // Sets the "Current total members" message in #rules_and_info
    var guild = client.guilds.get(`382585019300053013`);
    var bots = guild.members.filter(member => member.user.bot);
    guild.channels.get(`382640041358262285`).fetchMessage(`423594731994611723`).then(msg => msg.edit(`:busts_in_silhouette: **Current total members: \`${guild.memberCount-bots.size}\`**`));
  }

  var playings = [
    
    /* Playing */
    [`with Shin-Ae`, {type: `PLAYING`}], 
    [`with James`, {type: `PLAYING`}], 
    [`with Nen`, {type: `PLAYING`}], 
    [`with fire`, {type: `PLAYING`}], 
    [`on Webtoons instead of working`, {type: `PLAYING`}], 
    [`with your heart`, {type: `PLAYING`}], 
    [`with Shen`, {type: `PLAYING`}], 
    [`with Shenpai`, {type: `PLAYING`}],
    [`with SAI`, {type: `PLAYING`}], 
    [`some game or something idrk`, {type: `PLAYING`}], 
    [`with the big boys`, {type: `PLAYING`}], 
    [`with Madi`, {type: `PLAYING`}], 
    [`in Webtoonland`, {type: `PLAYING`}], 
    [`in Wonderland`, {type: `PLAYING`}], 
    [`Adobe Illustrator`, {type: `PLAYING`}], 
    [`Fire Alpaca`, {type: `PLAYING`}], 
    [`for the money`, {type: `PLAYING`}], 
    [`YAAAASSSSS`, {type: `PLAYING`}], 
    [`with my code`, {type: `PLAYING`}], 
    [`with time`, {type: `PLAYING`}], 
    [`in space`, {type: `PLAYING`}], 
    [`for the good guys`, {type: `PLAYING`}], 
    [`with other bots`, {type: `PLAYING`}], 
    [`with the ratelimit ;)`, {type: `PLAYING`}], 
    [`with the Podcast crew`, {type: `PLAYING`}], 
    [`[status]`, {type: `PLAYING`}], 
    [`[object Object]`, {type: `PLAYING`}], 
    [`against the clock`, {type: `PLAYING`}], 
    [`Error 503: Forbidden`, {type: `PLAYING`}], 
    [`with your ships`, {type: `PLAYING`}], 
    [`Monopoly`, {type: `PLAYING`}], 
    [`with life in a box`, {type: `PLAYING`}], 
    [`with life`, {type: `PLAYING`}], 
    [`with the other lurkers`, {type: `PLAYING`}], 
    [`with the skin of my enemies`, {type: `PLAYING`}], 
    [`for the glory`, {type: `PLAYING`}], 
    [`with friends`, {type: `PLAYING`}], 
    [`on the beach`, {type: `PLAYING`}], 
    [`at the mall`, {type: `PLAYING`}], 
    [`at home`, {type: `PLAYING`}], 
    [`on the couch`, {type: `PLAYING`}], 
    [`?¿`, {type: `PLAYING`}], 
    [`devil's advocate`, {type: `PLAYING`}], 
    [`Poker`, {type: `PLAYING`}], 
    [`MS Paint`, {type: `PLAYING`}], 
    [`with Kowoks`, {type: `PLAYING`}], 
    [`with Uru-chan`, {type: `PLAYING`}], 
    [`with Quimchee`, {type: `PLAYING`}], 
    [`with Chris McCoy @ Safely Endangered`, {type: `PLAYING`}], 
    [` `, {type: `PLAYING`}],
    [`nothing. Why do you care?? ugh`, {type: `PLAYING`}],

    /* Watching */
    [`Netflix`, {type: `WATCHING`}],
    [`you`, {type: `WATCHING`}],
    [`you sleep`, {type: `WATCHING`}],
    [`nothing. Why do you care?? ugh`, {type: `WATCHING`}],

    /* Listening to */
    [`Spotify`, {type: `LISTENING`}],
    [`your conversations-- I mean what`, {type: `LISTENING`}],
    [`nothing. Why do you care?? ugh`, {type: `LISTENING`}]

  ];

  // Both `wait` and `client.log` are in `./modules/functions`.
  client.logger.log(`[READY] ${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, `ready`);

  // We check for any guilds added while the bot was offline, if any were, they get a default configuration.
  client.guilds.filter(g => !client.settings.has(g.id)).forEach(g => client.settings.set(g.id, client.config.defaultSettings));

  Tags.sync();

  Array.prototype.randomElement = function(array) {
    return array[Math.floor(Math.random() * array.length)];
  };

  setInterval(() => {
    var randomPl = playings.randomElement(playings);
    client.user.setActivity(`${randomPl[0]} | !w help`, randomPl[1]);
  }, 60000);

  setInterval(() => {
    client.channels.get(`447132033173422090`).bulkDelete(1);
  }, 8.64e+7);

  // Support for the role menus for Webtoon Central

  var genre = client.channels.get('444375693728546816');
  genre.fetchMessage('466280999760953355')
  .then(async msg => {
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
      member = genre.guild.members.get(member);

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
  })

  var ping = client.channels.get('440974386544115713')
  ping.fetchMessage('466281139418693633')
  .then(async msg => {
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
    member = ping.guild.members.get(member);

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

var misc = client.channels.get('444375656139063296');
misc.fetchMessage('467164172153782283')
.then(async msg => {
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
};
