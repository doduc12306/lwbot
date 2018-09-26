const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  try {
    var reason = args.slice(1).join(' ');
    var bhEmote = '<a:hammerglitched:459396837741297671>';

    if(!message.guild.me.permissions.has('BAN_MEMBERS')) return message.channel.send(`:x: \`|\` ${bhEmote} **I am missing permissions:** \`Ban Members\``);
    if(!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send(`:x: \`|\` ${bhEmote} **You are missing permissions:** \`Ban Members\``);
    if(!args[0]) return message.channel.send(`:x: \`|\` ${bhEmote} **You didn't give the ID of someone to ban!**`);
    await client.fetchUser(args[0]).catch(() => message.channel.send(`:x: \`|\` ${bhEmote} **I could not find that user!**`));

    var toBan = await client.fetchUser(args[0]);

    await message.guild.modbase.create({
      victim: toBan.id,
      moderator: message.author.id,
      type: 'hackban'
    }).then(async info => {
      if(reason) message.guild.modbase.update({ reason: reason }, { where: {id: info.id }});

      var modEmbed = new Discord.RichEmbed()
        .setThumbnail(toBan.avatarURL)
        .setColor(client.config.colors.black)
        .setFooter(`ID: ${toBan.id} | Case: ${info.id}`)
        .addField('Hackbanned User', `${toBan.toString()} (${toBan.tag})`)
        .addField('Moderator', `${message.author.toString()} (${message.author.tag})`);

      if(reason) modEmbed.addField('Reason', reason);

      await message.guild.ban(toBan.id, {days: 2});
      await message.guild.settings.get('modLogChannel')
        .then(async modLogChannel => {
          message.guild.channels.find('name', modLogChannel) ? message.guild.channels.find('name', modLogChannel).send(modEmbed) : false; await message.channel.send(`:white_check_mark: \`|\` ${bhEmote} **Banned user \`${toBan.tag}\`**`);
        })
        .catch(async () => message.channel.send(`:warning: **Ban completed, but there is no mod log channel set.** Try \`${await message.guild.settings.get('prefix')}set <edit/add> modLogChannel <channel name>\``));

    });
  } catch (e) {console.log(e);}

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['idban'],
  permLevel: 'Moderator'
};

exports.help = {
  name: 'hackban',
  description: 'Ban someone who isn\'t in the server',
  usage: 'hackban <id> [reason]',
  category: 'Moderation'
};