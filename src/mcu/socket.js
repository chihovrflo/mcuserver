import net from 'net';

export default class MCUSocket {
  constructor ({ port, host }) {
    this.port = port;
    this.host = host;
    this.ip = `${host}:${port}`;
    this.socket = null;
    this.listeners = [];
    this.interval = null;
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
      this.socket.write(event);
    }
  }

  setInterval () {
    if (this.isConnected()) {
      const that = this;
      this.interval = setInterval(() => {
        that.socket.write('DataRead');
      }, 1000);
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
      const that = this;
      this.socket.on('end', () => {
        console.log('結束連線!');
        clearInterval(that.interval);
        console.log('interval: ', that.interval);
      });
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
