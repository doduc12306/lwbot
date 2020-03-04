const Websocket = require('ws');
const port = 13807;
module.exports = (client) => {
  if(!client) return console.error('No client parameter passed.');

  // Create a new websocket server using the port defined above
  const wss = new Websocket.Server({ port });
  client.logger.log(`Websocket server opened on port ${port}`);

  // When a new client connects to the websocket
  wss.on('connection', (ws, req) => {
    client.logger.log(`New websocket connection! IP: ${req.connection.remoteAddress}`);
    const connectionTimer = setTimeout(() => ws.close(1000, 'Took too long to send identify and key'), 3000);

    // When the client sends a message to the websocket
    ws.on('message', message => {
      message = JSON.parse(message);

      client.logger.verbose('New websocket message:');
      client.logger.verbose(message);

      if (!['identify', 'reconnect'].includes(message.action)) return ws.close(1001, 'Invalid request');

      // This is up here because it runs before the identification check
      // Also, no key check because it's gonna close anyway.
      if(message.action === 'reconnect') {
        clearTimeout(connectionTimer);
        client.logger.log('Websocket reconnected! Closing connection...', 'ready');
        ws.close(1003, 'Reconnection successful.');
        return;
      }
      
      if (message.key !== process.env.FAILOVER_WEBSOCKET_KEY) return ws.close(1002, 'Invalid key');
      clearTimeout(connectionTimer);
      ws.send(JSON.stringify({ action: 'identified' }));
    });

    ws.on('close', (code, reason) => {
      if(code === 1006) {
        client.logger.warn('Websocket process ended! PMing owner now...');
        return client.users.cache.get(client.config.ownerID).send(':warning: **Failover process closed.** Please check PM2.');
      }
      if(code === 1003) return; // Code 1003 = Reconnection successful
      client.logger.warn(`Websocket closed! Code: ${code} | Reason: ${reason}`);
    });
  });
};