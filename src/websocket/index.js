import WebSocket from 'ws';
import MCUDetector from 'mcu/detector';
import getUniqueID from './getUniqueID';

export default function ({ server }) {
  const wss = new WebSocket.Server({ server });
  const detector = new MCUDetector();

  wss.getUniqueID = getUniqueID;

  wss.on('connection', function (ws) {
    ws.id = wss.getUniqueID();
    wss.clients.forEach((client) => console.log('Client.ID: ' + client.id));
    console.log('--------------');

    ws.on('message', function (msg) {
      console.log(msg);
      const parseMsg = JSON.parse(msg);
      console.log(parseMsg.type);
      switch (parseMsg.type) {
        case 'ADD_MCU_SOCKET': {
          const { port, host } = parseMsg.data;
          const socket = detector.detectMCUSocket({ port, host });
          if (socket?.isConnected()) {
            socket.addListener(ws);
          }
          setTimeout(() => socket.broadcast(), 3000);
        }
      }
    });
    ws.on('close', () => console.log(`${ws.id} is closed!`));
  });
}
