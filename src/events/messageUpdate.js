module.exports = async (client, oldMessage, newMessage) => {
  if(client.msgCmdHistory[newMessage.id]) {
    newMessage.edited = true;
    client.emit('message', newMessage);
  }
};