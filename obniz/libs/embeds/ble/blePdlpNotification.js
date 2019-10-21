const BleRemotePdlpDevice = require('./bleRemotePdlpDevice');
const ID = 0x01;
const MESSAGES = {
  CONFIRM_NOTIFY_CATEGORY: 0x06,
  CONFIRM_NOTIFY_CATEGORY_RESP: 0x07,
  NOTIFY_INFORMATION: 0x02,
  GET_PD_NOTIFY_DETAIL_DATA: 0x03,
  GET_PD_NOTIFY_DETAIL_DATA_RESP: 0x04,
  NOTIFY_PD_GENERAL_INFORMATION: 0x05,
};
const PARAMETERS = {
  ResultCode: { id: 0x00, length: 1 },
  Cancel: { id: 0x01, length: 1 },
  GetStatus: { id: 0x02, length: 1 },
  NotifyCategory: { id: 0x03, length: 2 },
  NotifyCategoryIDs: { id: 0x04, length: 2 },
  GetParameterID: { id: 0x05, length: 1 },
  GetParameterLength: { id: 0x06, length: 4 },
  ParameterIdList: { id: 0x07, lenght: 2 },
  UniqueId: { id: 0x08, lenght: 2 },
  NotifyId: { id: 0x09, lenght: 2 },
  NotificationOperation: { id: 0x0a, lenght: 1 },
  Title: { id: 0x0b, lenght: undefined },
  Text: { id: 0x0c, lenght: undefined },
  AppName: { id: 0x0d, lenght: undefined },
  AppNameLocal: { id: 0x0e, lenght: undefined },
  NotifyApp: { id: 0x0f, lenght: undefined },
  RumblingSetting: { id: 0x10, lenght: 1 },
  VibrationPattern: { id: 0x11, lenght: undefined },
  LedPattern: { id: 0x12, lenght: undefined },
  Sender: { id: 0x13, lenght: undefined },
  SenderAddress: { id: 0x14, lenght: undefined },
  ReceiveDate: { id: 0x15, lenght: 7 },
  StartDate: { id: 0x16, lenght: 7 },
  EndDate: { id: 0x17, lenght: 7 },
  Area: { id: 0x18, lenght: undefined },
  Person: { id: 0x19, lenght: undefined },
  MimeTypeForImage: { id: 0x1a, lenght: undefined },
  MimeTypeForMedia: { id: 0x1b, lenght: undefined },
  Image: { id: 0x1c, lenght: undefined },
  Contents1: { id: 0x1d, lenght: undefined },
  Contents2: { id: 0x1e, lenght: undefined },
  Contents3: { id: 0x1f, lenght: undefined },
  Contents4: { id: 0x20, lenght: undefined },
  Contents5: { id: 0x21, lenght: undefined },
  Contents6: { id: 0x22, lenght: undefined },
  Contents7: { id: 0x23, lenght: undefined },
  Contents8: { id: 0x24, lenght: undefined },
  Contents9: { id: 0x25, lenght: undefined },
  Contents10: { id: 0x26, lenght: undefined },
  Media: { id: 0x27, lenght: undefined },
  Package: { id: 0x28, lenght: undefined },
  BeepPattern: { id: 0x2b, lenght: undefined },
};
class BlePdlpNotification {
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

module.exports = BlePdlpNotification;
