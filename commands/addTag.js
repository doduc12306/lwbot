module.exports.run = async (client, message, args) => {
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

  await Tags.sync();
    
  const tagName = args.shift();
  const tagDescription = args.join(` `);
    
  try {
    // equivalent to: INSERT INTO tags (name, descrption, username) values (?, ?, ?);
    const tag = await Tags.create({
      name: tagName,
      description: tagDescription,
      username: message.author.username,
    });
    return message.reply(`Tag ${tag.name} added.`);
  }
  catch (e) {
    if (e.name === `SequelizeUniqueConstraintError`) {
      return message.reply(`That tag already exists.`);
    }
    return message.reply(`Something went wrong with adding a tag.
        ${e}`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [`addtag`, `tagadd`],
  permLevel: `Bot Owner`
};

exports.help = {
  name: `addTag`,
  description: `Adds a tag to the database`,
  usage: `addTag <tag name> <tag data>\n**Tag name must be one word**`,
  category: `Tags`
};