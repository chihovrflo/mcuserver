import WebSocket from 'ws';
import getUniqueID from './getUniqueID';

export default function ({ server }) {
  const wss = new WebSocket.Server({ server });

  wss.getUniqueID = getUniqueID;

  wss.on('connection', function (ws) {
    ws.id = wss.getUniqueID();
    wss.clients.forEach((client) => console.log('Client.ID: ' + client.id));
    console.log('--------------');

    ws.on('message', function (msg) {
      // const mcu1 = new MCUSocket({ port: 1500, host: '192.168.51.5' });
      // mcu1.connect();
      // mcu1.write('FanOn');
      // mcu1.onData((data) => {
      //   ws.send(data);
      //   console.log(`received data: ${data}`);
      // });
      console.log(msg);
      ws.send(msg);
    });
    ws.on('close', () => console.log(`${ws.id} is closed!`));
  });
}
