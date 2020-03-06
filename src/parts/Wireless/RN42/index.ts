/**
 * @packageDocumentation
 * @module Parts.RN42
 */

import Obniz from "../../../obniz";
import PeripheralUART from "../../../obniz/libs/io_peripherals/uart";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface RN42Options {
  tx: number;
  rx: number;
  gnd?: number;
}

export type RN42Config_Mode =
  | "slave"
  | "master"
  | "trigger"
  | "auto-connect-master"
  | "auto-connect-dtr"
  | "auto-connect-any"
  | "pairing";
export type RN42Config_Profile = "SPP" | "DUN-DCE" | "DUN-DTE" | "MDM-SPP" | "SPP-DUN-DCE" | "APL" | "HID";
export type RN42Config_Auth = "open" | "ssp-keyboard" | "just-work" | "pincode";
export type RN43Config_Power = 16 | 12 | 8 | 4 | 0 | -4 | -8;

export interface RN42Config {
  display_name?: string;
  master_slave?: RN42Config_Mode;
  profile?: RN42Config_Profile;
  auth?: RN42Config_Auth;
  power?: RN43Config_Power;
  hid_flag?: any;
}

export default class RN42 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "RN42",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public onreceive?: (data: any, text: string) => void;

  protected obniz!: Obniz;

  private uart!: PeripheralUART;

  constructor() {
    this.keys = ["tx", "rx", "gnd"];
    this.requiredKeys = ["tx", "rx"];
  }

  public wired(obniz: Obniz) {
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

    this.uart.onreceive = (data: any, text: any) => {
      // this is not perfect. separation is possible.
      if (text.indexOf("CONNECT") >= 0) {
        // console.log("connected");
      } else if (text.indexOf("DISCONNECT") >= 0) {
        // console.log("disconnected");
      }
      if (typeof this.onreceive === "function") {
        this.onreceive(data, text);
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

  public config(json: RN42Config) {
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
      for (let i = 0; i < modes.length; i++) {
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
      const modes: any = ["SPP", "DUN-DCE", "DUN-DTE", "MDM-SPP", "SPP-DUN-DCE", "APL", "HID"];
      for (let i = 0; i < modes.length; i++) {
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
      for (let i = 0; i < modes.length; i++) {
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
