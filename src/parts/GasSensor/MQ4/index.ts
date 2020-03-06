/**
 * @packageDocumentation
 * @module Parts.MQ4
 */
import MQGas, { MQGasSensorOptions } from "../MQGas";

export interface MQ4Options extends MQGasSensorOptions {}

export default class MQ4 extends MQGas {
  public static info() {
    return {
      name: "MQ4",
    };
  }

  constructor() {
    super();
  }
}
