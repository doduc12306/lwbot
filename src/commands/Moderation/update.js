module.exports.run = async (client, message, args) => {
  const id = args[0];
  const reason = args.splice(1).join(' ');

  if (!id) return message.send('❌ **You didn\'t give the ID of a case to update!**');

  const log = await message.guild.modbase.findOne({ where: { id: id } });
  if (!log) return message.send(`❌ **I couldn't find case** \`${id}\`!`);
  if (!reason) return message.send('❌ **You didn\'t give a new reason!**');

  message.guild.modbase.update({ reason: reason }, { where: { id: id } }).then(() => {
    message.send(`✅ **Updated case** \`${id}\` **with reason** \`${reason}\`.`);
  }).catch(e => message.send(`❌ **Error:** ${e}`));
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['reason'],
  permLevel: 'Moderator'
};

exports.help = {
  name: 'update',
  description: 'Update the reason for a case',
  usage: 'update <case ID> <new reason>',
  category: 'Moderation'
};