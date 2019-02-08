const WebSocket = require('ws');

const ws = new WebSocket('ws://127.0.0.1:8080');

ws.on('open', function open() {
  ws.send('Connecting');
});

ws.on('close', () => {
  console.log('Ws closed!');
  process.exit();
});