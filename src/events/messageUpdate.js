module.exports = async (client, oldMessage, newMessage) => {
  if(client.msgCmdHistory[newMessage.id]) {
    client.verbose('messageUpdate');
    newMessage.edited = true;
    client.emit('message', newMessage);
  }
};