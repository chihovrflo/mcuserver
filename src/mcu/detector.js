import MCUSocket from './socket';

export default class MCUDetector {
  constructor () {
    this.mcuSocketList = [];
  }

  detectMCUSocket ({ port, host }) {
    const targetIndex = this.mcuSocketList.findIndex((mcuSocket) => mcuSocket.ip === `${host}:${port}`);
    if (targetIndex === -1) return this.addMCUSocket({ port, host });
    return this.mcuSocketList[targetIndex];
  }

  addMCUSocket ({ port, host }) {
    try {
      const mcuSocket = new MCUSocket({ port, host });
      mcuSocket.connect();
      const newMCUSocketList = [...this.mcuSocketList, mcuSocket];
      this.mcuSocketList = newMCUSocketList;
      return mcuSocket;
    } catch (error) {
      console.log('Add MCU Socket error:', error);
    }
  }

  removeMCUSocket (ip) {
    let targetSocketIsExist = false;
    const newMCUSocketList = this.mcuSocketList.map((mcuSocket) => {
      const isNotTargetSocket = mcuSocket.ip !== ip;
      if (!isNotTargetSocket) {
        clearInterval(mcuSocket.interval);
        mcuSocket.socket.destroy();
        targetSocketIsExist = true;
      }
      return isNotTargetSocket;
    });
    if (!targetSocketIsExist) console.log('remove MCU Socket target is NOT Exist');
    this.mcuSocketList = newMCUSocketList;
  }
}
