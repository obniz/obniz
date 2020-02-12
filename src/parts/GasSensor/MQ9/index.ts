/**
 * @packageDocumentation
 * @module Parts.MQ9
 */
import MQGas, { MQGasSensorOptions } from "../MQGas";

/**
 * @category Parts
 */
export interface  MQ9Options extends MQGasSensorOptions { }

/**
 * @category Parts
 */
export default class MQ9 extends MQGas {

  public static info() {
    return {
      name: "MQ9",
    };
  }

  constructor() {
    super();
  }

}
