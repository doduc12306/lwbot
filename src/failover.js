/* eslint-disable */
const Websocket = require('ws');
const { join } = require('path');
require('dotenv').config({ path: join(__dirname, '../.env') });

const port = process.env.PORT || 13807;
const ws = new Websocket(`ws://localhost:${port}`);

ws.on('open', () => {
  console.log('Connected. identifying...');
  ws.send(JSON.stringify({ action: 'identify', key: process.env.FAILOVER_WEBSOCKET_KEY }));
});

ws.on('close', (code, reason) => {
  if (code === 1006) {
    console.log('CONNECTION TO MAIN PROCESS WAS CLOSED.');
    console.log('ASSUMING MAIN PROCESS WENT OFFLINE');
    console.log('STARTING FAILOVER PROCESS...');
    global.failover = true;
    const { startup } = require('./startup');
    startup();
    return;
  }
  console.error(`Failover websocket connection closed! Code: ${code} | Reason: ${reason}`);
});

ws.on('message', message => {
  message = JSON.parse(message);

  if (message.action !== 'identified') return ws.close(4, 'Failover websocket did not authenticate properly');
  console.log('Failover websocket authenticated. Watching main process...');
});

process.on('uncaughtException', error => {
  if(error.code === 'ECONNREFUSED') console.error('CONNECTION REFUSED: Main process websocket is not open.');
  else console.error(error);
  process.exit(1);
});