/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import Obniz from "../../index";
import { ComponentAbstract } from "../ComponentAbstact";
import ObnizUtil from "../utils/util";
import { BitType, DriveType, FlowControlType, ParityType, PullType, StopBitType } from "./common";

export interface PeripheralUARTOptions {
  /**
   *  Pin no of tx is used for sending data from obniz Board to parts.
   */
  tx: number;

  /**
   * Pin no of used for receiving data from parts to obniz Board.
   */
  rx: number;

  /**
   * Gnd pin no
   */
  gnd?: number;

  /**
   * Uart baud rate. efault is 115200bps
   */
  baud?: number;

  /**
   * Uart stop bit type.
   * Default is 1 Stop bit
   */
  stop?: StopBitType;

  /**
   * Uart bits. Default is 8bit
   */
  bits?: BitType;

  /**
   * Uart parity check. Default is "off"
   */
  parity?: ParityType;

  /**
   * Uart flow control type.
   * Default is off.
   */
  flowcontrol?: FlowControlType;

  /**
   * Pin no of rts
   */
  rts?: number;

  /**
   * Pin no of cts
   */
  cts?: number;

  /**
   * Pin drive type.
   */
  drive?: DriveType;

  /**
   * Pin pull type
   */
  pull?: PullType;
}

/**
 * Uart module
 * @category Peripherals
 */
export default class PeripheralUART extends ComponentAbstract {
  public received: any;

  /**
   * @ignore
   */
  public used!: boolean;

  /**
   * It is called when data is received.
   * Data is array of bytes.
   * Text is the same data but in text representation.
   *
   *
   * So, if obniz Board receives 'A'.
   * - Data is [0x41]
   * - Text is "A"
   *
   * ```javascript
   * // Javascript Example
   * obniz.uart0.start({tx:0, rx:1})
   * obniz.uart0.onreceive = function(data, text) {
   *   console.log(data);
   *   console.log(text);
   * }
   * obniz.uart0.send("Hello");
   * ```
   *
   */
  public onreceive?: (data: number[], text: string) => void;

  private id: number;
  private params: any;

  constructor(obniz: Obniz, id: number) {
    super(obniz);
    this.id = id;

    this.on("/response/uart/receive", (obj) => {
      if (this.onreceive) {
        const string: any = this.tryConvertString(obj.data);
        this.Obniz._runUserCreatedFunction(this.onreceive, obj.data, string);
      } else {
        if (!this.received) {
          this.received = [];
        }
        this.received.push.apply(this.received, obj.data);
      }
    });
    this._reset();
  }

  /**
   * It starts uart on io tx, rx.
   *
   * You can start uart without much configuration. Just use as below.
   * @param params
   */
  public start(params: PeripheralUARTOptions) {
    const err: any = ObnizUtil._requiredKeys(params, ["tx", "rx"]);
    if (err) {
      throw new Error("uart start param '" + err + "' required, but not found ");
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

  /**
   * This sends data.
   *
   * Available formats are
   *
   * - string
   * utf8 encoded byte array. Does not include null terminate
   *
   * - number
   * will be one byte data
   *
   * - array of number
   * array of bytes
   *
   * - Buffer
   * array of bytes
   *
   *
   * ```javascript
   * // Javascript Example
   * obniz.uart0.start({tx:0, rx:1})
   * obniz.uart0.send("Hi");
   * obniz.uart0.send(0x11);
   * obniz.uart0.send([0x11, 0x45, 0x44]);
   * ```
   * @param data
   */
  public send(data: string | number | number[] | Buffer) {
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
    if (this.Obniz.isNode && data instanceof Buffer) {
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

  /**
   * It checks if there are data received but not yet used.
   * If there are, it returns true.
   *
   * If you are using onreceive callback, it will always be false because you receive the data with the callback function as the data arrives.
   *
   * ```javascript
   * // Javascript Example
   * obniz.uart0.start({tx:0, rx:1})
   *
   * while(1){
   *   if(obniz.uart0.isDataExists()){
   *      console.log(obniz.uart0.readText());
   *   }
   *   await obniz.wait(10);  //wait for 10ms
   * }
   * ```
   *
   */
  public isDataExists(): boolean {
    return this.received && this.received.length > 0;
  }

  /**
   * It returns the data array that are received but not yet used.
   *
   * ```javascript
   * // Javascript Example
   * obniz.uart0.start({tx:0, rx:1})
   *
   * while(1){
   *   if(obniz.uart0.isDataExists()){
   *      console.log(obniz.uart0.readBytes());
   *   }
   *   await obniz.wait(10);  //wait for 10ms
   * }
   * ```
   * @return received data. If not exist data, return [].
   */
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

  /**
   * It returns the one byte that are received but not yet used.
   *
   * ```javascript
   * // Javascript Example
   * obniz.uart0.start({tx:0, rx:1})
   *
   * while(1){
   *    if(obniz.uart0.isDataExists()){
   *      console.log(obniz.uart0.readBytes());
   *    }
   *    await obniz.wait(10);  //wait for 10ms
   * }
   * ```
   *
   * @return received data. If not exist data, return null.
   */
  public readByte(): number | null {
    const results: any = [];
    if (this.isDataExists()) {
      return results.unshift();
    }
    return null;
  }

  /**
   * It returns the data that are received but not yet used as string.
   *
   * ```javascript
   * // Javascript Example
   * obniz.uart0.start({tx:0, rx:1})
   *
   * while(1){
   *   if(obniz.uart0.isDataExists()){
   *     console.log(obniz.uart0.readText());
   *   }
   *   await obniz.wait(10);  //wait for 10ms
   * }
   * ```
   *
   * @return received text data. If not exist data, return null.
   */
  public readText(): string | null {
    let string: string | null = null;
    if (this.isDataExists()) {
      const data: any = this.readBytes();
      string = this.tryConvertString(data);
    }
    this.received = [];
    return string;
  }

  /**
   * @ignore
   */
  public isUsed(): boolean {
    return this.used;
  }

  /**
   * It stops uart and releases io.
   *
   * ```javascript
   * // Javascript Example
   * obniz.uart0.start({tx:0, rx:1})
   * obniz.uart0.send("Hi");
   * obniz.uart0.end();
   * ```
   */
  public end() {
    const obj: any = {};
    obj["uart" + this.id] = null;
    this.params = null;
    this.Obniz.send(obj);
    this.used = false;
  }

  /**
   * Convert data array to string.
   *
   * @param data data array
   *
   * @return converted string. If convert failed, return null.
   */
  public tryConvertString(data: number[]): string | null {
    return ObnizUtil.dataArray2string(data);
  }

  /**
   * @ignore
   * @private
   */
  public schemaBasePath(): string {
    return "uart" + this.id;
  }

  /**
   * @ignore
   * @private
   */
  protected _reset() {
    this.received = new Uint8Array([]);
    this.used = false;
  }
}
