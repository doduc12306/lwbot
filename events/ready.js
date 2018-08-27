const Sequelize = require(`sequelize`);
const Discord = require(`discord.js`);
const sequelize = new Sequelize(`database`, `user`, `password`, {
  host: `localhost`,
  dialect: `sqlite`,
  logging: false,
  // SQLite only
  storage: `tags.sqlite`,
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
    [`Error 403: Forbidden`, {type: `PLAYING`}],
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
  client.logger.log(`${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, `ready`);

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
};
