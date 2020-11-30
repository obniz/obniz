/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import Obniz from "../../index";
import { ComponentAbstract } from "../ComponentAbstact";
import { DriveType, PullType } from "./common";

/**
 * General purpose IO
 * This is available on each io (for obniz Board series, it's io0 to io11)
 * @category Peripherals
 */
export default class PeripheralIO extends ComponentAbstract {
  private value!: boolean;
  private onchange?: (value: boolean) => void;
  private id: number;

  constructor(obniz: Obniz, id: number) {
    super(obniz);
    this.id = id;

    this.on("/response/io/get", (obj) => {
      this.value = obj;
      this.Obniz._runUserCreatedFunction(this.onchange, obj);
    });

    this.on("/response/io/warning", (obj) => {
      this.Obniz.warning({
        alert: "warning",
        message: `io${this.id}: ${obj.warning.message}`,
      });
    });

    this.on("/response/io/error", (obj) => {
      this.Obniz.error({
        alert: "error",
        message: `io${this.id}: ${obj.error.message}`,
      });
    });

    this._reset();
  }

  /**
   * Make ioX to output mode and put out 1 or 0.
   *
   * ```javascript
   * // Javascript Example
   * obniz.io1.output(true); // io1 is 5v
   * obniz.io2.output(1); //  io2 is 5v
   * obniz.io3.drive("3v");
   * obniz.io3.output(1); // io3 is around 3v.
   * ```
   *
   * @param value output value
   */
  public output(value: boolean | 0 | 1) {
    value = !!value;
    const obj: any = {};
    obj["io" + this.id] = value;
    this.value = value;
    this.Obniz.send(obj);
  }

  /**
   * This allows you to change output drive method.
   * By default, it is set as push-pull 5v.
   *
   * ```javascript
   * // Javascript Example
   * obniz.io0.output(true); // output push-pull 5v
   *
   * obniz.io1.drive("3v");
   * obniz.io1.output(true); // output push-pull 3v
   *
   * obniz.io2.pull("5v");
   * obniz.io2.drive("open-drain");
   * obniz.io2.output(true); // output open-drain with 5v pull-up
   * ```
   *
   * @param drive
   *
   */
  public drive(drive: DriveType) {
    if (typeof drive !== "string") {
      throw new Error("please specify drive methods in string");
    }
    let output_type: any = "";
    switch (drive) {
      case "5v":
        output_type = "push-pull5v";
        break;
      case "3v":
        output_type = "push-pull3v";
        break;
      case "open-drain":
        output_type = "open-drain";
        break;
      default:
        throw new Error("unknown drive method");
    }

    const obj: any = {};
    obj["io" + this.id] = {
      output_type,
    };
    this.Obniz.send(obj);
  }

  /**
   * This enables/disables internal weak pull up/down resistors.
   *
   * ```javascript
   * // Javascript Example
   * obniz.io0.pull("3v");
   * obniz.io0.drive("open-drain"); // output open-drain
   * obniz.io0.output(false);
   * ```
   *
   * @param updown
   *
   */
  public pull(updown: PullType) {
    if (typeof updown !== "string" && updown !== null) {
      throw new Error("please specify pull methods in string");
    }
    let pull_type: any = "";
    switch (updown) {
      case "5v":
        pull_type = "pull-up5v";
        break;
      case "3v":
        pull_type = "pull-up3v";
        break;
      case "0v":
        pull_type = "pull-down";
        break;
      case null:
        pull_type = "float";
        break;
      default:
        throw new Error("unknown pull_type method");
    }

    const obj: any = {};
    obj["io" + this.id] = {
      pull_type,
    };
    this.Obniz.send(obj);
  }

  /**
   * Make ioX to input mode.
   * Callback function will be called when io changes its input value.
   *
   *
   * @param callback
   */
  public input(callback: (value: boolean) => void) {
    this.onchange = callback;
    const obj: any = {};
    obj["io" + this.id] = {
      direction: "input",
      stream: true,
    };
    this.Obniz.send(obj);
    return this.value;
  }

  /**
   * Make ioX to input mode.
   *
   * And this will return the current input value.
   * It pauses the process until the value is returned.
   *
   * ```javascript
   * // Javascript Example
   * var value = await obniz.io0.inputWait();
   * console.log(value);
   * ```
   */
  public async inputWait(): Promise<boolean> {
    const obj: any = {};
    obj[this.schemaBasePath()] = {
      direction: "input",
      stream: false,
    };
    const data = await this.sendAndReceiveJsonWait(obj, "/response/io/get");
    return data;
  }

  /**
   * This ends output/input on ioX.
   *
   *
   * This function is effective only when using ioX.output() or ioX.input().
   * This won't be called when AD/UART/etc are used.
   * Pull-up down also will not affected.
   *
   * ```
   * // Javascript Example
   * obniz.io0.output(true)
   * obniz.io0.end();
   * ```
   *
   */
  public end() {
    const obj: any = {};
    obj["io" + this.id] = null;
    this.Obniz.send(obj);
  }

  /**
   * @ignore
   * @private
   */
  public schemaBasePath(): string {
    return "io" + this.id;
  }

  /**
   * @ignore
   * @private
   */
  protected _reset() {
    this.value = false;
  }
}
