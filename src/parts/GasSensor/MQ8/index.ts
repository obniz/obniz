/**
 * @packageDocumentation
 * @module Parts.MQ8
 */
import MQGas, { MQGasSensorOptions } from "../MQGas";

/**
 * @category Parts
 */
export interface  MQ8Options extends MQGasSensorOptions { }

/**
 * @category Parts
 */
export default class MQ8 extends MQGas {

  public static info() {
    return {
      name: "MQ8",
    };
  }

  constructor() {
    super();
  }

}
