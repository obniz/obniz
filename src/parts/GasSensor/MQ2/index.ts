/**
 * @packageDocumentation
 * @module Parts.MQ2
 */
import MQGas, { MQGasSensorOptions } from "../MQGas";

/**
 * @category Parts
 */
export interface  MQ2Options extends MQGasSensorOptions { }

/**
 * @category Parts
 */
export default class MQ2 extends MQGas {

  public static info() {
    return {
      name: "MQ2",
    };
  }

  constructor() {
    super();
  }

}
