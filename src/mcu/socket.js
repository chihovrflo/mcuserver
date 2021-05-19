import net from 'net';

export default class MCUSocket {
  constructor ({ port, host }) {
    this.port = port;
    this.host = host;
    this.ip = `${host}:${port}`;
    this.socket = null;
    this.listeners = [];
  }

  async connect () {
    this.socket = await net.connect({
      port: this.port,
      host: this.host
    }, () => console.log(`${this.ip} 連接成功!`));
  }

  command (type, data = {}) {
    if (this.isConnected()) this.socket.write({ type, data });
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
    if (this.socket?.readyState === 1) return true;
    console.log(`${this.ip} 尚未連接!`);
    return false;
  }

  addListener (ws) {
    const newListenerList = [...this.listeners, ws];
    console.log(newListenerList);
    this.listeners = newListenerList;
  }

  removeListener (wsId) {
    const newListenerList = this.listeners.map((ws) => ws.id !== wsId);
    this.listeners = newListenerList;
  }

  broadcast () {
    this.listeners.forEach((ws) => ws.send('fuck u!'));
  }
}
