/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import Obniz from "../../index";

export default class PeripheralAD {
  public Obniz: Obniz;
  public id: number;

  /**
   * called when voltage gets changed.
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
  private observers!: Array<(value: number) => void>;

  constructor(obniz: Obniz, id: number) {
    this.Obniz = obniz;
    this.id = id;
    this._reset();
  }

  /**
   * @ignore
   */
  public _reset() {
    this.value = 0.0;
    this.observers = [];
  }

  public addObserver(callback: (value: number) => void) {
    if (callback) {
      this.observers.push(callback);
    }
  }

  /**
   * This starts measuring voltage on ioX until end() is called.
   * ```Javascript
   * obniz.ad0.start(function(voltage){
   *  console.log("changed to "+voltage+" v")
   * });
   * ```
   * @param callback  called when voltage gets changed.
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
  public getWait(): Promise<number> {
    const self: any = this;
    return new Promise((resolve: any, reject: any) => {
      self.addObserver(resolve);
      const obj: any = {};
      obj["ad" + self.id] = {
        stream: false,
      };
      self.Obniz.send(obj);
    });
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
   * @param obj
   */
  public notified(obj: number) {
    this.value = obj;
    if (this.onchange) {
      this.onchange(obj);
    }
    const callback: any = this.observers.shift();
    if (callback) {
      callback(obj);
    }
  }
}
