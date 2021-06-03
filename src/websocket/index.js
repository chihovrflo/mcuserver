import WebSocket from 'ws';
import MCUDetector from 'mcu/detector';
import getUniqueID from 'utils/getUniqueID';

export default function ({ server }) {
  const wss = new WebSocket.Server({ server });
  const detector = new MCUDetector();
  wss.getUniqueID = getUniqueID;

  wss.on('connection', function (ws) {
    ws.id = wss.getUniqueID();
    wss.clients.forEach((client) => console.log('Client.ID: ' + client.id));
    console.log('--------------');

    ws.on('message', function (msg) {
      const parseMsg = JSON.parse(msg);
      switch (parseMsg.type) {
        case 'ADD_MCU_SOCKET': {
          const { port, host } = parseMsg.data;
          const socket = detector.detectMCUSocket({ port, host, wsId: ws.id });
          socket.addListener(ws);
          ws.socket = socket;
          break;
        }
        case 'SOCKET_CMD': {
          if (ws.socket) {
            const { type, data } = parseMsg.payload;
            if (type === 'TempSetup' || type === 'FanSetup' || type === 'BulbSetup') {
              ws.socket.command(`${type} ${data.temp}`);
            } else {
              ws.socket.command(type);
            }
          }
        }
      }
    });
    ws.on('close', () => {
      ws.socket.removeListener(ws.id);
      if (ws.socket.listeners.length === 0) {
        console.log(`${ws.socket.ip} listeners is Empty!`);
        detector.removeMCUSocket(ws.socket.ip);
      }
      console.log(`${ws.id} is closed!`);
    });
  });
}
