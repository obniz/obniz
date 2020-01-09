class RN42 {

  public static info() {
    return {
      name: "RN42",
    };
  }

  public keys: any;
  public requiredKeys: any;
  public params: any;
  public uart: any;
  public obniz: any;
  public onreceive: any;

  constructor() {
    this.keys = ["tx", "rx", "gnd"];
    this.requiredKeys = ["tx", "rx"];
  }

  public wired(obniz: any) {
    if (obniz.isValidIO(this.params.gnd)) {
      obniz.getIO(this.params.gnd).output(false);
    }

    this.uart = obniz.getFreeUart();

    this.uart.start({
      tx: this.params.tx,
      rx: this.params.rx,
      baud: 115200,
      drive: "3v",
    });
    const self: any = this;
    this.uart.onreceive = (data, text) => {
      // this is not perfect. separation is possible.
      if (text.indexOf("CONNECT") >= 0) {
        console.log("connected");
      } else if (text.indexOf("DISCONNECT") >= 0) {
        console.log("disconnected");
      }
      if (typeof self.onreceive === "function") {
        self.onreceive(data, text);
      }
    };
  }

  public send(data: any) {
    this.uart.send(data);
  }

  public sendCommand(data: any) {
    this.uart.send(data + "\n");
    this.obniz.wait(100);
  }

  public enterCommandMode() {
    this.send("$$$");
    this.obniz.wait(100);
  }

  public config(json: any) {
    this.enterCommandMode();
    if (typeof json !== "object") {
      // TODO: warning
      return;
    }
    // remove noize data
    this.sendCommand("");

    if (json.master_slave) {
      this.config_masterslave(json.master_slave);
    }
    if (json.auth) {
      this.config_auth(json.auth);
    }
    if (json.hid_flag) {
      this.config_HIDflag(json.hid_flag);
    }
    if (json.profile) {
      this.config_profile(json.profile);
    }
    if (json.power) {
      this.config_power(json.power);
    }
    if (json.display_name) {
      this.config_displayName(json.display_name);
    }
    this.config_reboot();
  }

  public config_reboot() {
    this.sendCommand("R,1");
  }

  public config_masterslave(mode: any) {
    let val: any = -1;
    if (typeof mode === "number") {
      val = mode;
    } else if (typeof mode === "string") {
      const modes: any = [
        "slave",
        "master",
        "trigger",
        "auto-connect-master",
        "auto-connect-dtr",
        "auto-connect-any",
        "pairing",
      ];
      for (let i: any = 0; i < modes.length; i++) {
        if (modes[i] === mode) {
          val = i;
          break;
        }
      }
    }
    if (val === -1) {
      // TODO: warning
      return;
    }
    this.sendCommand("SM," + val);
  }

  public config_displayName(name: any) {
    this.sendCommand("SN," + name);
  }

  // // SH,0200 HID Flag register. Descriptor=keyboard
  public config_HIDflag(flag: any) {
    this.sendCommand("SH," + flag);
  }

  public config_profile(mode: any) {
    let val: any = -1;
    if (typeof mode === "number") {
      val = mode;
    } else if (typeof mode === "string") {
      const modes: any = [
        "SPP",
        "DUN-DCE",
        "DUN-DTE",
        "MDM-SPP",
        "SPP-DUN-DCE",
        "APL",
        "HID",
      ];
      for (let i: any = 0; i < modes.length; i++) {
        if (modes[i] === mode) {
          val = i;
          break;
        }
      }
    }
    if (val === -1) {
      // TODO: warning
      return;
    }
    this.sendCommand("S~," + val);
  }

  public config_revert_localecho() {
    this.sendCommand("+");
  }

  public config_auth(mode: any) {
    let val: any = -1;
    if (typeof mode === "number") {
      val = mode;
    } else if (typeof mode === "string") {
      const modes: any = ["open", "ssp-keyboard", "just-work", "pincode"];
      for (let i: any = 0; i < modes.length; i++) {
        if (modes[i] === mode) {
          val = i;
          break;
        }
      }
    }
    if (val === -1) {
      // TODO: warning
      return;
    }
    this.sendCommand("SA," + val);
  }

  public config_power(dbm: any) {
    let val: any = "0010";
    if (16 > dbm && dbm >= 12) {
      val = "000C";
    } else if (12 > dbm && dbm >= 8) {
      val = "0008";
    } else if (8 > dbm && dbm >= 4) {
      val = "0004";
    } else if (4 > dbm && dbm >= 0) {
      val = "0000";
    } else if (0 > dbm && dbm >= -4) {
      val = "FFFC";
    } else if (-4 > dbm && dbm >= -8) {
      val = "FFF8";
    } else if (-8 > dbm) {
      val = "FFF4";
    }

    this.sendCommand("SY," + val);
  }

  public config_get_setting() {
    this.sendCommand("D");
  }

  public config_get_extendSetting() {
    this.sendCommand("E");
  }
}

if (typeof module === "object") {
  module.exports = RN42;
}
