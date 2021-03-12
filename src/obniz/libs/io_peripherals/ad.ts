/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import Obniz from "../../index";
import { ComponentAbstract } from "../ComponentAbstact";

/**
 * @category Peripherals
 */
export default class PeripheralAD extends ComponentAbstract {
  public id: number;

  /**
   * called when voltage gets changed.
   *
   * @param onchange.value voltage of pin
   */
  public onchange?: (value: number) => void;

  /**
   * The value will be stored in the value variable.
   *
   * Note: This property stores the last received value.
   * NOT the value when you read this property.
   *
   * ```Javascript
   * obniz.ad0.start();
   * while(true) {
   * console.log("changed to "+obniz.ad0.value+" v")
   *  await obniz.wait(10); // 10ms wait
   * }
   * ```
   */
  public value!: number;

  constructor(obniz: Obniz, id: number) {
    super(obniz);
    this.id = id;

    this.on("/response/ad/get", (obj) => {
      this.value = obj;
      this.Obniz._runUserCreatedFunction(this.onchange, obj);
    });

    this._reset();
  }

  /**
   * This starts measuring voltage on ioX until end() is called.
   * ```Javascript
   * obniz.ad0.start(function(voltage){
   *  console.log("changed to "+voltage+" v")
   * });
   * ```
   * @param callback  called when voltage gets changed.
   * @param callback.voltage  voltage
   */
  public start(callback?: (voltage: number) => void) {
    this.onchange = callback;
    const obj: any = {};
    obj["ad" + this.id] = {
      stream: true,
    };
    this.Obniz.send(obj);
    return this.value;
  }

  /**
   * This measures the voltage just once and returns its value.
   * This function will pause until ad result arrives to your js.
   *
   * ```javascript
   * obniz.io0.output(true)
   * var voltage = await obniz.ad0.getWait();
   * obniz.io0.output(false)
   * console.log(""+voltage+" should be closed to 5.00");
   * ```
   *
   * @return measured voltage
   *
   */
  public async getWait(): Promise<number> {
    const obj: any = {};
    obj["ad" + this.id] = {
      stream: false,
    };
    const data = await this.sendAndReceiveJsonWait(obj, "/response/ad/get");
    return data;
  }

  /**
   * This stops measuring voltage on ioX.
   * ```javascript
   * obniz.ad0.start();
   * obniz.ad0.end();
   * ```
   */
  public end() {
    this.onchange = undefined;
    const obj: any = {};
    obj["ad" + this.id] = null;
    this.Obniz.send(obj);
    return;
  }

  /**
   * @ignore
   * @private
   */
  public schemaBasePath(): string {
    return "ad" + this.id;
  }

  /**
   * @ignore
   * @private
   */
  protected _reset() {
    this.value = 0.0;
  }
}
