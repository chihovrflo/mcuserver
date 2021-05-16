import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import WebSocket from 'ws';
import MCU from './mcu/index';
// import net from 'net';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);

// function connectMCU (comm, callback) {
//   const client = net.connect({ port: 1500, host: '192.168.51.5' }, function () {
//     console.log('連接成功！');
//   });
//   client.write(comm);
//   client.on('data', function (data) {
//     callback(data.toString());
//     client.end();
//   });
//   client.on('end', function () {
//     console.log('結束連線');
//   });
// }

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', function (ws) {
  ws.on('message', function (msg) {
    const mcu1 = new MCU({ port: 1500, host: '192.168.51.5' });
    mcu1.connect();
    mcu1.write('FanOn');
    mcu1.onData((data) => {
      ws.send(data);
      console.log(`received data: ${data}`);
    });
    // connectMCU('FanOn', data => {
    //   ws.send(data);
    //   console.log(data);
    // });
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});
