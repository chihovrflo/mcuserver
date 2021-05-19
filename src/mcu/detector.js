import MCUSocket from './socket';

export default class MCUDetector {
  constructor () {
    this.mcuSocketList = [];
  }

  detectMCUSocket ({ port, host }) {
    const targetIndex = this.mcuSocketList.findIndex((mcuSocket) => mcuSocket.ip === `${host}:${port}`);
    if (targetIndex === -1) this.addMCUSocket({ port, host });
    return this.mcuSocketList[targetIndex];
  }

  addMCUSocket ({ port, host }) {
    try {
      const mcuSocket = new MCUSocket({ port, host });
      mcuSocket.connect();
      if (!mcuSocket.isConnected()) throw new Error('mcu socket is not connected!');
      const newMCUSocketList = [...this.mcuSocketList, mcuSocket];
      this.mcuSocketList = newMCUSocketList;
    } catch (error) {
      console.log('Add MCU Socket error:', error);
    }
  }

  removeMCUSocket (ip) {
    let targetSocketIsExist = false;
    const newMCUSocketList = this.mcuSocketList.map((mcuSocket) => {
      const isNotTargetSocket = mcuSocket.ip !== ip;
      if (!isNotTargetSocket) targetSocketIsExist = true;
      return isNotTargetSocket;
    });

    this.mcuSocketList = newMCUSocketList;
  }
}
