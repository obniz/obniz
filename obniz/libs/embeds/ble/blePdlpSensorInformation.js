const BleRemotePdlpDevice = require('./bleRemotePdlpDevice');
const ID = 0x04;
const MESSAGES = {
  GET_SENSOR_INFO: 0x00,
  GET_SENSOR_INFO_RESP: 0x01,
  SET_NOTIFY_SENSOR_INFO: 0x02,
  SET_NOTIFY_SENSOR_INFO_RESP: 0x03,
  NOTIFY_PD_SENSOR_INFO: 0x04,
};
const PARAMETERS = {
  ResultCode: { id: 0x00, length: 1 },
  Cancel: { id: 0x01, length: 1 },
  SensorType: { id: 0x02, length: 1 },
  Status: { id: 0x03, length: 1 },
  X_value: { id: 0x04, length: 4 },
  Y_value: { id: 0x05, length: 4 },
  Z_value: { id: 0x06, length: 4 },
  X_threshold: { id: 0x07, length: 4 },
  Y_threshold: { id: 0x08, length: 4 },
  Z_threshold: { id: 0x09, length: 4 },
  OriginalData: { id: 0x0a, length: undefined },
};
class BlePdlpSensorInformation {
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

module.exports = BlePdlpSensorInformation;
