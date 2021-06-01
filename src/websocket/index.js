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

    ws.on('message', async function (msg) {
      const parseMsg = JSON.parse(msg);
      switch (parseMsg.type) {
        case 'ADD_MCU_SOCKET': {
          const { port, host } = parseMsg.data;
          const socket = detector.detectMCUSocket({ port, host });
          socket.connect(() => {
            socket.onData((data) => {
              console.log(data);
              ws.send(data);
            });
            socket.addListener(ws);
            ws.socket = socket;
          });
          break;
        }
        case 'SOCKET_CMD': {
          if (ws.socket) {
            let { type, data } = parseMsg.payload;
            if(type === 'TempSetup' || type === 'FanSetup' || type === 'BulbSetup')
              ws.socket.command(`${type} ${data.temp}`);
            else{
              console.log(type);
              if(ws.socket) console.log('socket exists');
              else console.log('socket is not exist');
              ws.socket.command(type);
            }
          }
        }
      }
    });
    ws.on('close', () => console.log(`${ws.id} is closed!`));
  });
}
