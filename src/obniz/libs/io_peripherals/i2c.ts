import Obniz from "../../index";
import ObnizUtil from "../utils/util";
import {PullType} from "./common";

type I2CMode = "master" | "slave";

interface PeripheralI2CState {
  "mode": I2CMode;
  "sda": number;
  "scl": number;
  "pull"?: PullType;
  "gnd"?: number;
}

interface PeripheralI2COptions extends PeripheralI2CState {
  "mode": I2CMode;
  "sda": number;
  "scl": number;
  clock?: number;
  slave_address?: any;
  slave_address_length?: number;
}

class PeripheralI2C {
  public Obniz: Obniz;
  public id: number;
  public onerror?: (error: any) => void;
  public observers: any;
  public state!: PeripheralI2CState;
  public used!: boolean;
  public onwritten?: (data: any[], address: string) => void;

  constructor(obniz: Obniz, id: number) {
    this.Obniz = obniz;
    this.id = id;
    this._reset();
    this.onerror = undefined;
  }

  public _reset() {
    this.observers = [];
    this.used = false;
    this.onwritten = undefined;
  }

  public addObserver(callback: any) {
    if (callback) {
      this.observers.push(callback);
    }
  }

  public start(arg: PeripheralI2COptions) {
    const err: any = ObnizUtil._requiredKeys(arg, ["mode", "sda", "scl"]);
    if (err) {
      throw new Error("I2C start param '" + err + "' required, but not found ");
    }
    this.state = ObnizUtil._keyFilter(arg, [
      "mode",
      "sda",
      "scl",
      "pull",
      "gnd",
    ]);

    const ioKeys: Array<keyof PeripheralI2CState> = ["sda", "scl", "gnd"];
    for (const key of ioKeys) {
      if (this.state[key] && !this.Obniz.isValidIO(this.state[key])) {
        throw new Error("i2c start param '" + key + "' are to be valid io no");
      }
    }

    const mode: I2CMode = this.state.mode!;
    const clock: number | null = typeof arg.clock === "number" ? Math.floor(arg.clock) : null;
    const slave_address: number | null =
      typeof arg.slave_address === "number"
        ? Math.floor(arg.slave_address)
        : null;
    const slave_address_length: number | null =
      typeof arg.slave_address_length === "number"
        ? Math.floor(arg.slave_address_length)
        : null;

    if (mode !== "master" && mode !== "slave") {
      throw new Error("i2c: invalid mode " + mode);
    }
    if (mode === "master") {
      if (clock === null) {
        throw new Error("i2c: please specify clock when master mode");
      }
      if (clock <= 0 || clock > 1 * 1000 * 1000) {
        throw new Error("i2c: invalid clock " + clock);
      }
      if (arg.pull === "5v" && clock > 400 * 1000) {
        throw new Error(
          "i2c: please use under 400khz when internal 5v internal pull-up",
        );
      }
      if (arg.pull === "3v" && clock > 100 * 1000) {
        throw new Error(
          "i2c: please use under 100khz when internal 3v internal pull-up",
        );
      }
    } else {
      if (slave_address === null) {
        throw new Error("i2c: please specify slave_address");
      }
      if (slave_address < 0 || slave_address > 0x7f) {
        throw new Error("i2c: invalid slave_address");
      }
      if (slave_address < 0 || slave_address > 0x7f) {
        throw new Error("i2c: invalid slave_address");
      }
      if (slave_address_length !== null && slave_address_length !== 7) {
        throw new Error("i2c: invalid slave_address_length. please specify 7");
      }
    }

    this.Obniz.getIO(this.state.sda).drive("open-drain");
    this.Obniz.getIO(this.state.scl).drive("open-drain");

    if (this.state.pull) {
      this.Obniz.getIO(this.state.sda).pull(this.state.pull);
      this.Obniz.getIO(this.state.scl).pull(this.state.pull);
    } else {
      this.Obniz.getIO(this.state.sda).pull(null);
      this.Obniz.getIO(this.state.scl).pull(null);
    }

    if (this.state.gnd !== undefined) {
      this.Obniz.getIO(this.state.gnd).output(false);
      const ioNames: any = {};
      ioNames[this.state.gnd] = "gnd";
      if (this.Obniz.display) {
        this.Obniz.display.setPinNames("i2c" + this.id, ioNames);
      }
    }

    const startObj: any = ObnizUtil._keyFilter(this.state, ["mode", "sda", "scl"]);
    if (mode === "master") {
      startObj.clock = clock;
    } else {
      startObj.slave_address = slave_address;
      if (slave_address_length) {
        startObj.slave_address_length = slave_address_length;
      }
    }

    const obj: any = {};
    obj["i2c" + this.id] = startObj;
    this.used = true;
    this.Obniz.send(obj);
  }

  public write(address: any, data: any) {
    if (!this.used) {
      throw new Error(`i2c${this.id} is not started`);
    }
    address = parseInt(address);
    if (isNaN(address)) {
      throw new Error("i2c: please specify address");
    }
    if (address < 0 || address > 0x7f) {
      throw new Error("i2c: invalid address");
    }
    if (!data) {
      throw new Error("i2c: please provide data");
    }
    if (data.length > 1024) {
      throw new Error("i2c: data should be under 1024 bytes");
    }
    const obj: any = {};
    obj["i2c" + this.id] = {
      address,
      data,
    };
    this.Obniz.send(obj);
  }

  public readWait(address: any, length: any): Promise<number[]> {
    if (!this.used) {
      throw new Error(`i2c${this.id} is not started`);
    }
    address = parseInt(address);
    if (isNaN(address)) {
      throw new Error("i2c: please specify address");
    }
    if (address < 0 || address > 0x7f) {
      throw new Error("i2c: invalid address");
    }
    length = parseInt(length);
    if (isNaN(length) || length < 0) {
      throw new Error("i2c: invalid length to read");
    }
    if (length > 1024) {
      throw new Error("i2c: data length should be under 1024 bytes");
    }
    const self: any = this;
    return new Promise((resolve: any, reject: any) => {
      self.addObserver(resolve);
      const obj: any = {};
      obj["i2c" + self.id] = {
        address,
        read: length,
      };
      self.Obniz.send(obj);
    });
  }

  public notified(obj: any) {
    if (obj && typeof obj === "object") {
      if (obj.data) {
        if (obj.mode === "slave" && typeof this.onwritten === "function") {
          this.onwritten(obj.data, obj.address);
        } else {
          // TODO: we should compare byte length from sent
          const callback: any = this.observers.shift();
          if (callback) {
            callback(obj.data);
          }
        }
      }
      if (obj.warning) {
        this.Obniz.warning({
          alert: "warning",
          message: `i2c${this.id}: ${obj.warning.message}`,
        });
      }
      if (obj.error) {
        const message: any = `i2c${this.id}: ${obj.error.message}`;
        if (typeof this.onerror === "function") {
          this.onerror(new Error(message));
        } else {
          this.Obniz.error({
            alert: "error",
            message,
          });
        }
      }
    }
  }

  public isUsed() {
    return this.used;
  }

  public end() {
    const obj: any = {};
    obj["i2c" + this.id] = null;
    this.Obniz.send(obj);
    this.used = false;
  }
}

export default PeripheralI2C;
