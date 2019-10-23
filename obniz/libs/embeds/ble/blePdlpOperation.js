const ID = 0x02;
const NAME = 'Operation';
const MESSAGES = {
  NOTIFY_PD_OPERATION: 0x00,
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
  ButtonId: {
    id: 0x02,
    length: 1,
    type: 'enum',
    paramValues: {
      SingleClick: 0x02,
      DoubleClick: 0x04,
      LongPress: 0x07,
      LongPressRelease: 0x09,
      Power: 0x00,
      Return: 0x01,
      Home: 0x03,
      VolumeUp: 0x05,
      VolumeDown: 0x06,
      Pause: 0x08,
      FastForward: 0x0a,
      ReWind: 0x0b,
      Shutter: 0x0c,
      Up: 0x0d,
      Down: 0x0e,
      Left: 0x0f,
      Right: 0x10,
      Enter: 0x11,
      Menu: 0x12,
      Play: 0x13,
      Stop: 0x14,
    },
  },
};
const getEnumKey = function(e, val) {
  return Object.keys(e).find(k => e[k] === val);
};
const getParam = function(val) {
  return Object.values(PARAMETERS).find(k => k.id === val);
};
class BlePdlpOperation {
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

module.exports = BlePdlpOperation;
