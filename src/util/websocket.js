/* eslint-disable */
const Websocket = require('ws');
const port = 1337;
module.exports = (client) => {
  // Create a new websocket server using the port defined above
  const wss = new Websocket.Server({ port });
  client.logger.ws(`Websocket server opened on port ${port}`);

  // When a new client connects to the websocket
  wss.on('connection', (ws, req) => {
    client.logger.ws(`New websocket connection! IP: ${req.connection.remoteAddress}`);

    // When the client sends a message to the websocket
    ws.on('message', message => {
      // TODO: add something here lol
    });
  });
};