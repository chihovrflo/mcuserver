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

  async connect ({
    onEnd = () => {}
  }) {
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
        console.log('結束連線!');
        clearInterval(self.interval);
        console.log('interval: ', self.interval);
        onEnd();
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
    const newListenerList = [...this.listeners, ws];
    this.listeners = newListenerList;
  }

  removeListener (wsId) {
    const newListenerList = this.listeners.map((ws) => ws.id !== wsId);
    this.listeners = newListenerList;
  }

  broadcast (data) {
    console.log('broadcast: ', data);
    this.listeners.forEach((ws) => ws.send(data));
  }
}
