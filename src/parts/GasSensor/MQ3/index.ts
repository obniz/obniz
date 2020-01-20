import MQGas, { MQGasSensorOptions } from "../MQGas";

export interface MQ3Options extends MQGasSensorOptions { }

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
