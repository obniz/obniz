const ID = 0x01;
const NAME = 'Notification';
const MESSAGES = {
  CONFIRM_NOTIFY_CATEGORY: 0x06,
  CONFIRM_NOTIFY_CATEGORY_RESP: 0x07,
  NOTIFY_INFORMATION: 0x02,
  GET_PD_NOTIFY_DETAIL_DATA: 0x03,
  GET_PD_NOTIFY_DETAIL_DATA_RESP: 0x04,
  NOTIFY_PD_GENERAL_INFORMATION: 0x05,
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
  GetStatus: {
    id: 0x02,
    length: 1,
    type: 'enum',
    paramValues: {
      OK: 0x00,
      Partial: 0x01,
      Cancel: 0x02,
      Failed: 0x03,
      Error: 0x04,
      NotAvailable: 0x05,
      NotSupported: 0x06,
    },
  },
  NotifyCategory: {
    id: 0x03,
    length: 2,
    type: 'bit',
    paramValues: {
      NotNotify: 0x0001,
      All: 0x0002,
      PhoneIncomingCall: 0x0004,
      Mail: 0x0020,
      Schedule: 0x0040,
      General: 0x0080,
      Etc: 0x0100,
    },
  },
  NotifyCategoryIDs: {
    id: 0x04,
    length: 2,
    type: 'value',
  },
  GetParameterID: {
    id: 0x05,
    length: 1,
    type: 'value',
  },
  GetParameterLength: {
    id: 0x06,
    length: 4,
    type: 'value',
  },
  ParameterIdList: {
    id: 0x07,
    lenght: 2,
    type: 'value',
  },
  UniqueId: {
    id: 0x08,
    lenght: 2,
    type: 'value',
  },
  NotifyId: {
    id: 0x09,
    lenght: 2,
    type: 'value',
  },
  NotificationOperation: {
    id: 0x0a,
    lenght: 1,
    type: 'enum',
    paramValues: {
      AlreadyRead: 0x00,
      Delete: 0x01,
    },
  },
  Title: {
    id: 0x0b,
    lenght: undefined,
    type: 'value',
  },
  Text: {
    id: 0x0c,
    lenght: undefined,
    type: 'value',
  },
  AppName: {
    id: 0x0d,
    lenght: undefined,
    type: 'value',
  },
  AppNameLocal: {
    id: 0x0e,
    lenght: undefined,
    type: 'value',
  },
  NotifyApp: {
    id: 0x0f,
    lenght: undefined,
    type: 'value',
  },
  RumblingSetting: {
    id: 0x10,
    lenght: 1,
    type: 'bit',
    paramValues: {
      LED: 0x01,
      Vibration: 0x02,
      Beep: 0x04,
    },
  },
  VibrationPattern: {
    id: 0x11,
    lenght: undefined,
    type: 'value',
  },
  LedPattern: {
    id: 0x12,
    lenght: undefined,
    type: 'value',
  },
  Sender: {
    id: 0x13,
    lenght: undefined,
    type: 'value',
  },
  SenderAddress: {
    id: 0x14,
    lenght: undefined,
    type: 'value',
  },
  ReceiveDate: {
    id: 0x15,
    lenght: 7,
    type: 'value',
  },
  StartDate: {
    id: 0x16,
    lenght: 7,
    type: 'value',
  },
  EndDate: {
    id: 0x17,
    lenght: 7,
    type: 'value',
  },
  Area: {
    id: 0x18,
    lenght: undefined,
    type: 'value',
  },
  Person: {
    id: 0x19,
    lenght: undefined,
    type: 'value',
  },
  MimeTypeForImage: {
    id: 0x1a,
    lenght: undefined,
    type: 'value',
  },
  MimeTypeForMedia: {
    id: 0x1b,
    lenght: undefined,
    type: 'value',
  },
  Image: {
    id: 0x1c,
    lenght: undefined,
    type: 'value',
  },
  Contents1: {
    id: 0x1d,
    lenght: undefined,
    type: 'value',
  },
  Contents2: {
    id: 0x1e,
    lenght: undefined,
    type: 'value',
  },
  Contents3: {
    id: 0x1f,
    lenght: undefined,
    type: 'value',
  },
  Contents4: {
    id: 0x20,
    lenght: undefined,
    type: 'value',
  },
  Contents5: {
    id: 0x21,
    lenght: undefined,
    type: 'value',
  },
  Contents6: {
    id: 0x22,
    lenght: undefined,
    type: 'value',
  },
  Contents7: {
    id: 0x23,
    lenght: undefined,
    type: 'value',
  },
  Contents8: {
    id: 0x24,
    lenght: undefined,
    type: 'value',
  },
  Contents9: {
    id: 0x25,
    lenght: undefined,
    type: 'value',
  },
  Contents10: {
    id: 0x26,
    lenght: undefined,
    type: 'value',
  },
  Media: {
    id: 0x27,
    lenght: undefined,
    type: 'value',
  },
  Package: {
    id: 0x28,
    lenght: undefined,
    type: 'value',
  },
  BeepPattern: {
    id: 0x2b,
    lenght: undefined,
    type: 'value',
  },
};
const getEnumKey = function(e, val) {
  return Object.keys(e).find(k => e[k] === val);
};
const getParam = function(val) {
  return Object.values(PARAMETERS).find(k => k.id === val);
};
class BlePdlpNotification {
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

module.exports = BlePdlpNotification;
