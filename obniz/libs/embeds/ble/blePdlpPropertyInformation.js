const BleRemotePdlpDevice = require('./bleRemotePdlpDevice');
const ID = 0x00;
const MESSAGES = {
  GET_DEVICE_INFORMATION: 0,
  GET_DEVICE_INFORMATION_RESP: 1,
};
const PARAMETERS = {
  ResultCode: { id: 0, length: 1 },
  Cancel: { id: 1, length: 1 },
  FnList: { id: 2, length: 1 },
  DeviceId: { id: 3, length: 2 },
  DeviceUid: { id: 4, length: 4 },
  DeviceCapability: { id: 5, length: 1 },
  ExSensorType: { id: 7, length: 1 },
};
class BlePdlpPropertyInformation {
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

  request() {
    if (this.connected) {
      this.peripheral.write(this.ID, this.MESSAGES.GET_DEVICE_INFORMATION, []);
    }
  }
}

module.exports = BlePdlpPropertyInformation;
