import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import WebSocket from 'ws';
import MCU from './mcu/index';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const wss = new WebSocket.Server({ server });

wss.getUniqueID = function () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};

wss.on('connection', function (ws) {
  ws.id = wss.getUniqueID();
  wss.clients.forEach((client) => console.log('Client.ID: ' + client.id));

  ws.on('message', function (msg) {
    const mcu1 = new MCU({ port: 1500, host: '192.168.51.5' });
    mcu1.connect();
    mcu1.write('FanOn');
    mcu1.onData((data) => {
      ws.send(data);
      console.log(`received data: ${data}`);
    });
  });
  ws.on('close', () => console.log(`${ws.id} is closed!`));
});

server.listen(port, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});
