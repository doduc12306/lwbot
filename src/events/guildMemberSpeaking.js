/* eslint-disable */
module.exports = (client, member, speaking) => {
  const connection = client.voice.connections.get(member.guild.id);

  const audio = connection.receiver.createStream(member.user);
  connection.play(audio, { type: 'opus' });
}