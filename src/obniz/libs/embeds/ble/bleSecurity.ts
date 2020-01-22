import emitter = require("eventemitter3");
import semver = require("semver");

class BleSecurity {
  public Obniz: any;
  public emitter: any;

  constructor(Obniz: any) {
    this.Obniz = Obniz;
    this.emitter = new emitter();
  }

  public setModeLevel(mode: any, level: any) {
    let auth: any;
    let keys: any;
    let indicateSecurityLevel: any;

    if (mode === 1) {
      if (level === 1) {
        auth = [];
        indicateSecurityLevel = 0; // no pairing request
        keys = ["LTK", "IRK"];
      } else if (level === 2) {
        auth = ["bonding"];
        indicateSecurityLevel = 2;
        keys = ["LTK", "IRK"];
      } else if (level === 3) {
        // TODO
        // auth = ['bonding','mitm'];
        // indicateSecurityLevel = 3;
        // keys = ['LTK', 'IRK'];
      }
    } else if (mode === 2) {
      if (level === 1) {
        // TODO
        // auth = [];
        // keys = ['LTK', 'IRK','CSRK'];
      } else if (level === 2) {
        // TODO
        // auth = ['bonding'];
        // keys = ['LTK', 'IRK','CSRK'];
      }
    }

    if (
      auth !== undefined &&
      indicateSecurityLevel !== undefined &&
      keys !== undefined
    ) {
      this.setAuth(auth);
      this.setIndicateSecurityLevel(indicateSecurityLevel);
      this.setEnableKeyTypes(keys);
    } else {
      const msg: any = `BLE security mode${mode}, level${level} is not available.`;
      this.Obniz.error(msg);
      throw new Error(msg);
    }
  }

  public checkIntroducedFirmware(introducedVersion: any, functionName: any) {
    const results: any = semver.lt(this.Obniz.firmware_ver, introducedVersion);
    if (results) {
      const msg: any = `${functionName} is available obniz firmware ${introducedVersion}.( your obniz version is ${
        this.Obniz.firmware_ver
      })`;
      this.Obniz.error(msg);
      throw new Error(msg);
    }
  }

  public setAuth(authTypes: any) {
    this.checkIntroducedFirmware("1.1.0", "setAuth");
    if (!Array.isArray(authTypes)) {
      authTypes = [authTypes];
    }
    const sendTypes: any = authTypes
      .map ((elm: any) => {
        return elm.toLowerCase();
      })
      .filter((elm: any ) => {
        return ["mitm", "secure_connection", "bonding"].includes(elm);
      });

    if (sendTypes.length !== authTypes.length) {
      throw new Error("unknown auth type");
    }

    this.Obniz.send({
      ble: {
        security: {
          auth: authTypes,
        },
      },
    });
  }

  public setIndicateSecurityLevel(level: any) {
    this.checkIntroducedFirmware("1.1.0", "setIndicateSecurityLevel");

    if (typeof level !== "number") {
      throw new Error("unknown secrity level : " + level);
    }
    this.Obniz.send({
      ble: {
        security: {
          indicate_security_level: level,
        },
      },
    });
  }

  public setEnableKeyTypes(keyTypes: any) {
    this.checkIntroducedFirmware("1.1.0", "setEnableKeyTypes");
    if (!Array.isArray(keyTypes)) {
      keyTypes = [keyTypes];
    }
    const sendTypes: any = keyTypes
      .map ((elm: any) => {
        return elm.toLowerCase();
      })
      .filter((elm: any ) => {
        return ["ltk", "csrk", "irk"].includes(elm);
      });

    if (sendTypes.length !== keyTypes.length) {
      throw new Error("unknown key type");
    }

    this.Obniz.send({
      ble: {
        security: {
          key: {type: sendTypes},
        },
      },
    });
  }

  public setKeyMaxSize(size: any) {
    this.checkIntroducedFirmware("1.1.0", "setKeyMaxSize");
    if (typeof size !== "number") {
      throw new Error("please provide key size in number");
    }
    this.Obniz.send({
      ble: {
        security: {
          key: {max_size: size},
        },
      },
    });
  }

  public clearBondingDevicesList() {
    this.Obniz.send({
      ble: {
        security: {
          devices: {clear: true},
        },
      },
    });
  }

  public onerror(params: any) {
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
