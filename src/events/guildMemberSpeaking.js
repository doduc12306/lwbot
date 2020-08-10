/* eslint-disable */
module.exports = (client, member, speaking) => {
  // If bot is in failover mode, don't load this module.
  if (global.failover) return;

  const connection = client.voice.connections.get(member.guild.id);

  const audio = connection.receiver.createStream(member.user);
  connection.play(audio, { type: 'opus' });
}