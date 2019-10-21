const BleRemotePdlpDevice = require('./bleRemotePdlpDevice');
const ID = 0x04;
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
  ResultCode: { id: 0x00, length: 1 },
  Cancel: { id: 0x01, length: 1 },
  SettingNameType: { id: 0x02, length: 1 },
  AppName: { id: 0x03, length: undefined },
  FileVer: { id: 0x04, length: undefined },
  FileSize: { id: 0x05, length: 4 },
  InstallConfirmStatus: { id: 0x06, length: 1 },
  SettingInformationRequest: { id: 0x07, length: undefined },
  SettingInformationData: { id: 0x08, length: undefined },
  SettingNameData: { id: 0x09, length: undefined },
};
class BlePdlpSettingOperation {
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

module.exports = BlePdlpSettingOperation;
