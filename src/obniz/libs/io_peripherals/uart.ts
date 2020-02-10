import Obniz from "../../index";
import ObnizUtil from "../utils/util";
import {BitType, DriveType, FlowControlType, ParityType, PullType, StopBitType} from "./common";

const isNode: any = typeof window === "undefined";

interface PeripheralUARTOptions {
  tx: number;
  rx: number;
  gnd?: number;
  baud?: number;
  stop?: StopBitType;
  bits?: BitType;
  parity?: ParityType;
  flowcontrol?: FlowControlType;
  rts?: number;
  cts?: number;
  drive?: DriveType;
  pull?: PullType;
}

class PeripheralUART {
  public Obniz: Obniz;
  public id: number;
  public received: any;
  public used!: boolean;
  public params: any;
  public onreceive?: (data: any, text: string) => void;

  constructor(obniz: Obniz, id: number) {
    this.Obniz = obniz;
    this.id = id;
    this._reset();
  }

  public _reset() {
    this.received = new Uint8Array([]);
    this.used = false;
  }

  public start(params: PeripheralUARTOptions) {
    const err: any = ObnizUtil._requiredKeys(params, ["tx", "rx"]);
    if (err) {
      throw new Error(
        "uart start param '" + err + "' required, but not found ",
      );
    }
    this.params = ObnizUtil._keyFilter(params, [
      "tx",
      "rx",
      "baud",
      "stop",
      "bits",
      "parity",
      "flowcontrol",
      "rts",
      "cts",
      "drive",
      "pull",
      "gnd",
    ]);

    const ioKeys: any = ["rx", "tx", "rts", "cts", "gnd"];
    for (const key of ioKeys) {
      if (this.params[key] && !this.Obniz.isValidIO(this.params[key])) {
        throw new Error("uart start param '" + key + "' are to be valid io no");
      }
    }

    if (this.params.hasOwnProperty("drive")) {
      this.Obniz.getIO(this.params.rx).drive(this.params.drive);
      this.Obniz.getIO(this.params.tx).drive(this.params.drive);
    } else {
      this.Obniz.getIO(this.params.rx).drive("5v");
      this.Obniz.getIO(this.params.tx).drive("5v");
    }

    if (this.params.hasOwnProperty("pull")) {
      this.Obniz.getIO(this.params.rx).pull(this.params.pull);
      this.Obniz.getIO(this.params.tx).pull(this.params.pull);
    } else {
      this.Obniz.getIO(this.params.rx).pull(null);
      this.Obniz.getIO(this.params.tx).pull(null);
    }

    if (this.params.hasOwnProperty("gnd")) {
      this.Obniz.getIO(this.params.gnd).output(false);
      const ioNames: any = {};
      ioNames[this.params.gnd] = "gnd";
      if (this.Obniz.display) {
        this.Obniz.display.setPinNames("uart" + this.id, ioNames);
      }
    }

    const obj: any = {};
    const sendParams: any = ObnizUtil._keyFilter(this.params, [
      "tx",
      "rx",
      "baud",
      "stop",
      "bits",
      "parity",
      "flowcontrol",
      "rts",
      "cts",
    ]);
    obj["uart" + this.id] = sendParams;
    this.Obniz.send(obj);
    this.received = [];
    this.used = true;
  }

  public send(data: any) {
    if (!this.used) {
      throw new Error(`uart${this.id} is not started`);
    }
    let send_data: any = null;
    if (data === undefined) {
      return;
    }
    if (typeof data === "number") {
      data = [data];
    }
    if (isNode && data instanceof Buffer) {
      send_data = [...data];
    } else if (data.constructor === Array) {
      send_data = data;
    } else if (typeof data === "string") {
      const buf: any = Buffer.from(data);
      send_data = [...buf];
    }
    const obj: any = {};
    obj["uart" + this.id] = {};
    obj["uart" + this.id].data = send_data;
    //  console.log(obj);
    this.Obniz.send(obj);
  }

  public isDataExists(): boolean {
    return this.received && this.received.length > 0;
  }

  public readBytes(): number[] {
    const results: number[] = [];
    if (this.isDataExists()) {
      for (let i = 0; i < this.received.length; i++) {
        results.push(this.received[i]);
      }
    }
    this.received = [];
    return results;
  }

  public readByte(): number | null {
    const results: any = [];
    if (this.isDataExists()) {
      return results.unshift();
    }
    return null;
  }

  public readText(): string | null {
    let string: string | null = null;
    if (this.isDataExists()) {
      const data: any = this.readBytes();
      string = this.tryConvertString(data);
    }
    this.received = [];
    return string;
  }

  public tryConvertString(data: any) {
    return ObnizUtil.dataArray2string(data);
  }

  public notified(obj: any) {
    if (this.onreceive) {
      const string: any = this.tryConvertString(obj.data);
      this.onreceive(obj.data, string);
    } else {
      if (!this.received) {
        this.received = [];
      }

      this.received.push.apply(this.received, obj.data);
    }
  }

  public isUsed(): boolean {
    return this.used;
  }

  public end() {
    const obj: any = {};
    obj["uart" + this.id] = null;
    this.params = null;
    this.Obniz.send(obj);
    this.used = false;
  }
}

export default PeripheralUART;
