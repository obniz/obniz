/**
 * @packageDocumentation
 * @module Parts.MQ7
 */
import MQGas, { MQGasSensorOptions } from "../MQGas";

export interface MQ7Options extends MQGasSensorOptions {}

export default class MQ7 extends MQGas {
  public static info() {
    return {
      name: "MQ7",
    };
  }

  constructor() {
    super();
  }
}
