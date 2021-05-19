import MCUSocket from './socket';

export default class MCUDetector {
  constructor () {
    this.mcuSocketList = [];
  }

  async detectMCUSocket ({ port, host }) {
    const targetIndex = this.mcuSocketList.findIndex((mcuSocket) => mcuSocket.ip === `${host}:${port}`);
    if (targetIndex === -1) return await this.addMCUSocket({ port, host });
    return this.mcuSocketList[targetIndex];
  }

  async addMCUSocket ({ port, host }) {
    try {
      const mcuSocket = new MCUSocket({ port, host });
      await mcuSocket.connect();
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
      if (!isNotTargetSocket) targetSocketIsExist = true;
      return isNotTargetSocket;
    });

    this.mcuSocketList = newMCUSocketList;
  }
}
