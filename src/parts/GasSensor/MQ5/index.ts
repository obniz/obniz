/**
 * @packageDocumentation
 * @module Parts.MQ5
 */
import MQGas, { MQGasSensorOptions } from "../MQGas";

export interface MQ5Options extends MQGasSensorOptions {}

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
