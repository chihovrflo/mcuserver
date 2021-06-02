import WebSocket from 'ws';
import MCUDetector from 'mcu/detector';
import getUniqueID from './getUniqueID';
import { setUpDisplay, setUpAuto, setUpManual } from './actions';

export default function ({ server }) {
  const wss = new WebSocket.Server({ server });
  const detector = new MCUDetector();
  wss.getUniqueID = getUniqueID;

  wss.on('connection', function (ws) {
    ws.id = wss.getUniqueID();
    wss.clients.forEach((client) => console.log('Client.ID: ' + client.id));
    console.log('--------------');

    ws.on('message', async function (msg) {
      const parseMsg = JSON.parse(msg);
      switch (parseMsg.type) {
        case 'ADD_MCU_SOCKET': {
          const { port, host } = parseMsg.data;
          const socket = detector.detectMCUSocket({ port, host });
          socket.connect(() => {
            socket.onData((data) => {
              if (data.includes('OK, Now targetTemp is')) ws.send(setUpAuto(data));
              else if (data.includes('envTemp')) ws.send(setUpDisplay(data));
              else ws.send(setUpManual(data));
            });
            socket.onEnd();
            socket.addListener(ws);
            ws.socket = socket;
          });
          break;
        }
        case 'SOCKET_CMD': {
          if (ws.socket) {
            const { type, data } = parseMsg.payload;
            if (type === 'TempSetup' || type === 'FanSetup' || type === 'BulbSetup') { ws.socket.command(`${type} ${data.temp}`); } else {
              ws.socket.command(type);
            }
          }
        }
      }
    });
    ws.on('close', () => console.log(`${ws.id} is closed!`));
  });
}
