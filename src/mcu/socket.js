import net from 'net';
import setUp from './actions';

export default class MCUSocket {
  constructor ({ port, host }) {
    this.port = port;
    this.host = host;
    this.ip = `${host}:${port}`;
    this.socket = null;
    this.listeners = [];
    this.interval = null;
  }

  async connect () {
    this.socket = await net.connect({
      port: this.port,
      host: this.host
    }, () => {
      console.log(`connect: ${this.ip} 連接成功!`);
      const self = this;
      this.socket.on('data', (data) => {
        const src = data.toString();
        this.broadcast(setUp(src));
      });
      this.socket.on('end', () => {
        console.log(`connect: ${this.ip} 結束連線!`);
      });
      this.interval = setInterval(() => {
        self.socket.write('DataRead');
      }, 1000);
    });
  }

  command (event) {
    if (this.isConnected()) {
      this.socket.write(event);
    }
  }

  isConnected () {
    if (this.socket?.readyState === 'open') return true;
    console.log(`isconnected: ${this.ip} 尚未連接!`);
    return false;
  }

  addListener (ws) {
    const wsIndex = this.listeners.findIndex((listener) => listener.id === ws.id);
    if (wsIndex === -1) {
      const newListenerList = [...this.listeners, ws];
      this.listeners = newListenerList;
    } else console.log(`add listener: ws ${ws.id} is exist!`);
  }

  removeListener (wsId) {
    const wsIndex = this.listeners.findIndex((listener) => listener.id === wsId);
    if (wsIndex !== -1) {
      const newListenerList = [...this.listeners];
      newListenerList.splice(wsIndex, 1);
      this.listeners = newListenerList;
    } else console.log(`remove listener: ws ${wsId} is not exist!`);
  }

  broadcast (data) {
    this.listeners.forEach((ws) => ws.send(JSON.stringify(data)));
  }
}
