const ID = 0x04;
const NAME = 'Sensor Information';
const MESSAGES = {
  GET_SENSOR_INFO: 0x00,
  GET_SENSOR_INFO_RESP: 0x01,
  SET_NOTIFY_SENSOR_INFO: 0x02,
  SET_NOTIFY_SENSOR_INFO_RESP: 0x03,
  NOTIFY_PD_SENSOR_INFO: 0x04,
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
  SensorType: {
    id: 0x02,
    length: 1,
    type: 'enum',
    paramValues: {
      Gyroscope: 0x00,
      Accelerometer: 0x01,
      Orientation: 0x02,
      Battery: 0x03,
      Temperature: 0x04,
      Humidity: 0x05,
      AtmosphericPressure: 0x06,
      Open_Close: 0x07,
      HumanDetection: 0x08,
      Motion: 0x09,
      Brightness: 0x0a,
    },
  },
  Status: {
    id: 0x03,
    length: 1,
    type: 'enum',
    paramValues: {
      OFF: 0x00,
      ON: 0x01,
    },
  },
  X_value: {
    id: 0x04,
    length: 4,
    type: 'value',
  },
  Y_value: {
    id: 0x05,
    length: 4,
    type: 'value',
  },
  Z_value: {
    id: 0x06,
    length: 4,
    type: 'value',
  },
  X_threshold: {
    id: 0x07,
    length: 4,
    type: 'value',
  },
  Y_threshold: {
    id: 0x08,
    length: 4,
    type: 'value',
  },
  Z_threshold: {
    id: 0x09,
    length: 4,
    type: 'value',
  },
  OriginalData: {
    id: 0x0a,
    length: undefined,
    type: 'value',
  },
};
const getEnumKey = function(e, val) {
  return Object.keys(e).find(k => e[k] === val);
};
const getParam = function(val) {
  return Object.values(PARAMETERS).find(k => k.id === val);
};
class BlePdlpSensorInformation {
  static get ID() {
    return ID;
  }

  static get MESSAGES() {
    return MESSAGES;
  }

  static get PARAMETERS() {
    return PARAMETERS;
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

module.exports = BlePdlpSensorInformation;
