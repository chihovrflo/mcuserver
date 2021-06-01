import net from 'net';

export default class MCUSocket {
  constructor ({ port, host }) {
    this.port = port;
    this.host = host;
    this.ip = `${host}:${port}`;
    this.socket = null;
    this.listeners = [];
  }

  async connect (callback) {
    this.socket = await net.connect({
      port: this.port,
      host: this.host
    }, () => {
      console.log(`connect: ${this.ip} 連接成功!`);
      callback();
    });
  }

  command (event) {
    if (this.isConnected()) {
      this.socket.write(event,() => {
        console.log();
      });
      console.log(event);
    }
  }

  onData (callback) {
    if (this.isConnected()) {
      this.socket.on('data', (data) => {
        callback(data.toString());
      });
    }
  }

  onEnd () {
    if (this.isConnected()) {
      this.socket.on('end', () => console.log('結束連線!'));
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

  broadcast () {
    this.listeners.forEach((ws) => ws.send('broadcast OK'));
  }
}
