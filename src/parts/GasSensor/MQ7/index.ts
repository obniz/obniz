import MQGas, { MQGasSensorOptions } from "../MQGas";

/**
 * @category Parts
 */
export interface  MQ7Options extends MQGasSensorOptions { }

/**
 * @category Parts
 */
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
