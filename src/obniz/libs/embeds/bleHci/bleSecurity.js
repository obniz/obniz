const emitter = require("eventemitter3");

class BleSecurity {
  constructor(Obniz) {
    this.Obniz = Obniz;
    this.emitter = new emitter();
  }

  setModeLevel(mode, level) {
    throw new Error("setModeLevel is deprecated method");
  }

  checkIntroducedFirmware(introducedVersion, functionName) {
    throw new Error("checkIntroducedFirmware is deprecated method");
  }

  setAuth(authTypes) {
    throw new Error("setAuth is deprecated method");
  }

  setIndicateSecurityLevel(level) {
    throw new Error("setIndicateSecurityLevel is deprecated method");
  }

  setEnableKeyTypes(keyTypes) {
    throw new Error("setEnableKeyTypes is deprecated method");
  }

  setKeyMaxSize(size) {
    throw new Error("setKeyMaxSize is deprecated method");
  }

  clearBondingDevicesList() {
    throw new Error("clearBondingDevicesList is deprecated method");
  }

  onerror() {
  } //dummy

  notifyFromServer(notifyName, params) {
    switch (notifyName) {
      case "onerror": {
        this.onerror(params);
        break;
      }
    }
  }
}

module.exports = BleSecurity;
