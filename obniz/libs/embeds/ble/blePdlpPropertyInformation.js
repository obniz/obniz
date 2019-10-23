const BleRemotePdlpDevice = require('./bleRemotePdlpDevice');
const ID = 0x00;
const NAME = 'Property Information';
const MESSAGES = {
  GET_DEVICE_INFORMATION: 0,
  GET_DEVICE_INFORMATION_RESP: 1,
};
const PARAMETERS = {
  ResultCode: {
    id: 0,
    length: 1,
    type: 'enum',
    paramValues: {
      OK: 0x00,
      Cancel: 0x01,
      Failed: 0x02,
      Error: 0x03,
      NotAvailable: 0x04,
      NotSupported: 0x05,
    },
  },
  Cancel: {
    id: 1,
    length: 1,
    type: 'enum',
    paramValues: {
      UserCancel: 0x00,
    },
  },
  FnList: {
    id: 2,
    length: 1,
    type: 'bit',
    paramValues: {
      PropertyInformation: 0x01,
      Notification: 0x02,
      Operation: 0x04,
      SensorInformation: 0x08,
      SettingOperation: 0x10,
    },
  },
  DeviceId: {
    id: 3,
    length: 2,
    type: 'value',
  },
  DeviceUid: {
    id: 4,
    length: 4,
    type: 'value',
  },
  DeviceCapability: {
    id: 5,
    length: 1,
    type: 'bit',
    paramValues: {
      Reserved: 0x01,
      Gyroscope: 0x02,
      Accelerometer: 0x04,
      Orientation: 0x08,
      Battery: 0x10,
      Temperature: 0x20,
      Humidity: 0x40,
      AtmosphericPressure: 0x80,
    },
  },
  ExSensorType: {
    id: 7,
    length: 1,
    type: 'bit',
    paramValues: {
      Version1: 0x01,
      Version2: 0x02,
      Flag: 0x04,
      Button: 0x08,
      OpenClose: 0x10,
      Motion: 0x20,
      Vibration: 0x40,
      Brigthness: 0x80,
    },
  },
};
const getEnumKey = function(e, val) {
  return Object.keys(e).find(k => e[k] === val);
};
const getParam = function(val) {
  return Object.values(PARAMETERS).find(k => k.id === val);
};
class BlePdlpPropertyInformation {
  static get ID() {
    return ID;
  }

  static get MESSAGES() {
    return MESSAGES;
  }

  static get PARAMETERS() {
    return PARAMETERS;
  }

  request(peripheral) {
    if (peripheral instanceof BleRemotePdlpDevice && peripheral.connected) {
      peripheral.writeFinal(this.ID, this.MESSAGES.GET_DEVICE_INFORMATION);
    }
  }

  static parse(data) {
    let obj = {};
    if (Array.isArray(data)) {
      data.shift();
      if (data[0] !== ID) {
        return {};
      } else {
        obj['function'] = NAME;
        obj['message'] = getEnumKey(MESSAGES, (data[1] << 8) + data[2]);
        let paramNo = data[3];
        data = data.slice(4, data.length);
        obj['parameters'] = {};
        for (let i = 0; i < paramNo; i++) {
          let pid = data[0];
          let plen = (data[1] << 16) + (data[2] << 8) + data[3];
          let pval = 0;
          for (let k = 1; k <= plen; k++) {
            pval += data[3 + k] << ((plen - k) * 8);
          }
          let param = getParam(pid);
          let opt = [];
          switch (param.type) {
            case 'enum':
              obj['parameters'][getEnumKey(PARAMETERS, param)] = getEnumKey(
                param.paramValues,
                pval
              );
              break;
            case 'bit':
              for (let bit in Object.values(param.paramValues)) {
                if (pval & bit) opt.push(getEnumKey(param.paramValues, bit));
              }
              obj['parameters'][getEnumKey(PARAMETERS, param)] = opt;
              break;
            case 'value':
              obj['parameters'][getEnumKey(PARAMETERS, param)] = pval;
              break;
          }
          data = data.slice(5 + i * plen, data.lenght);
        }
      }
    }
    return obj;
  }
}

module.exports = BlePdlpPropertyInformation;
