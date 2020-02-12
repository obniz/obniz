/**
 * @packageDocumentation
 * @module Parts.MQ3
 */
import MQGas, { MQGasSensorOptions } from "../MQGas";

/**
 * @category Parts
 */
export interface  MQ3Options extends MQGasSensorOptions { }

/**
 * @category Parts
 */
export default class MQ3 extends MQGas {

  public static info() {
    return {
      name: "MQ3",
    };
  }

  constructor() {
    super();
  }

}
