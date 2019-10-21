const BleRemotePdlpDevice = require('./bleRemotePdlpDevice');
const ID = 0x02;
const MESSAGES = {
  NOTIFY_PD_OPERATION: 0x00,
};
const PARAMETERS = {
  ResultCode: { id: 0x00, length: 1 },
  Cancel: { id: 0x01, length: 1 },
  ButtonId: { id: 0x02, length: 1 },
};
class BlePdlpOperation {
  constructor(peripheral) {
    if (peripheral instanceof BleRemotePdlpDevice) {
      this.device = peripheral;
    }
  }

  static get connected() {
    if (this.device) return this.device.connected;
    else return false;
  }

  static get ID() {
    return ID;
  }

  static get MESSAGES() {
    return MESSAGES;
  }

  static get PARAMETERS() {
    return PARAMETERS;
  }
}

module.exports = BlePdlpOperation;
