import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import WebSocket from 'ws';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', function (ws) {
  ws.on('message', function (msg) {
    console.log(`received: ${msg}`);
    ws.send(msg);
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});
