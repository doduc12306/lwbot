const Sequelize = require(`sequelize`);
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

module.exports.run = async (client, message) => {
  // equivalent to: SELECT name FROM tags;
  const tagList = await Tags.findAll({ attributes: [`name`] });
  const tagString = tagList.map(t => t.name).join(`, `) || `No tags set.`;
  return message.channel.send(`List of tags: ${tagString}`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [`listtags`, `showalltags`, `tags`],
  permLevel: `User`
};

exports.help = {
  name: `showtags`,
  description: `Shows all available tags`,
  usage: `showtags`,
  category: `Tags`
};