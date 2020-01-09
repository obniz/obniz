import emitter = require("eventemitter3");

class BleSecurity {
  public Obniz: any;
  public emitter: any;

  constructor(Obniz: any) {
    this.Obniz = Obniz;
    this.emitter = new emitter();
  }

  public setModeLevel(mode: any, level: any) {
    throw new Error("setModeLevel is deprecated method");
  }

  public checkIntroducedFirmware(introducedVersion: any, functionName: any) {
    throw new Error("checkIntroducedFirmware is deprecated method");
  }

  public setAuth(authTypes: any) {
    throw new Error("setAuth is deprecated method");
  }

  public setIndicateSecurityLevel(level: any) {
    throw new Error("setIndicateSecurityLevel is deprecated method");
  }

  public setEnableKeyTypes(keyTypes: any) {
    throw new Error("setEnableKeyTypes is deprecated method");
  }

  public setKeyMaxSize(size: any) {
    throw new Error("setKeyMaxSize is deprecated method");
  }

  public clearBondingDevicesList() {
    throw new Error("clearBondingDevicesList is deprecated method");
  }

  public onerror() {
  } // dummy

  public notifyFromServer(notifyName: any, params: any) {
    switch (notifyName) {
      case "onerror": {
        this.onerror(params);
        break;
      }
    }
  }
}

export default BleSecurity;
