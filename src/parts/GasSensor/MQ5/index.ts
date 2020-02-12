/**
 * @packageDocumentation
 * @module Parts.MQ5
 */
import MQGas, { MQGasSensorOptions } from "../MQGas";

/**
 * @category Parts
 */
export interface  MQ5Options extends MQGasSensorOptions { }

/**
 * @category Parts
 */
export default class MQ5 extends MQGas {

  public static info() {
    return {
      name: "MQ5",
    };
  }

  constructor() {
    super();
  }

}
