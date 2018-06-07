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

module.exports.run = async (client, message, args) => {
  const tagName = args;
  const rowCount = await Tags.destroy({ where: { name: tagName } });
  if (!rowCount) return message.reply(`That tag did not exist.`);
    
  return message.reply(`Tag deleted.`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [`removetag`, `deletetag`],
  permLevel: `Bot Owner`
};

exports.help = {
  name: `deltag`,
  description: `Deletes a tag from the database`,
  usage: `deltag <tag name>`,
  category: `Tags`
};