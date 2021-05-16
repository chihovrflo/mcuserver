import net from 'net';

class MCU {
  constructor ({ port, host }) {
    this.port = port;
    this.host = host;
    this.url = `${host}:${port}`;
    this.socket = null;
    this.listeners = [];
  }

  connect () {
    this.socket = net.connect({
      port: this.port,
      host: this.host
    }, () => console.log(`${this.url} 連接成功!`));
  }

  write (cmd) {
    if (this.isConnected) {
      this.socket.write(cmd);
    }
  }

  onData (callback) {
    if (this.isConnected) {
      this.socket.on('data', (data) => {
        callback(data.toString());
        this.socket.end();
      });
    }
  }

  onEnd () {
    if (this.isConnected) {
      this.socket.on('end', () => console.log('結束連線!'));
    }
  }

  isConnected () {
    if (this.socket) return true;
    console.log(`${this.url} 尚未連接!`);
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
}

export default MCU;
