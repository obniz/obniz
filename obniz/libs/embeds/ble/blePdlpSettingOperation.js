const ID = 0x04;
const NAME = 'Setting Operation';
const MESSAGES = {
  GET_APP_VERSION: 0x00,
  GET_APP_VERSION_RESP: 0x01,
  CONFIRM_INSTALL_APP: 0x02,
  CONFIRM_INSTALL_APP_RESP: 0x03,
  GET_SETTING_NAME: 0x04,
  GET_SETTING_NAME_RESP: 0x05,
  SELECT_SETTING_INFORMATION: 0x06,
  SELECT_SETTING_INFORMATION_RESP: 0x07,
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
  SettingNameType: {
    id: 0x02,
    length: 1,
    type: 'enum',
    paramValues: {
      LEDColorName: 0x00,
      LEDPatternName: 0x01,
      VibrationPatternName: 0x02,
      BeepPatternName: 0x03,
    },
  },
  AppName: {
    id: 0x03,
    length: undefined,
    type: 'value',
  },
  FileVer: {
    id: 0x04,
    length: undefined,
    type: 'value',
  },
  FileSize: {
    id: 0x05,
    length: 4,
    type: 'value',
  },
  InstallConfirmStatus: {
    id: 0x06,
    length: 1,
    type: 'enum',
    paramValues: {
      OK: 0x00,
      Cancel: 0x01,
      Failed: 0x02,
      Error: 0x03,
      NotAvailable: 0x04,
      NotSupported: 0x05,
      NoSpace: 0x06,
      AlreadyInstalled: 0x07,
      NewerInstalled: 0x08,
    },
  },
  SettingInformationRequest: {
    id: 0x07,
    length: undefined,
    type: 'value',
  },
  SettingInformationData: {
    id: 0x08,
    length: undefined,
    type: 'value',
  },
  SettingNameData: {
    id: 0x09,
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
class BlePdlpSettingOperation {
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

module.exports = BlePdlpSettingOperation;
