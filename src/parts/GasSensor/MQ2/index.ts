/**
 * @packageDocumentation
 * @module Parts.MQ2
 */
import MQGas, { MQGasSensorOptions } from '../MQGas';

export type MQ2Options = MQGasSensorOptions;

export default class MQ2 extends MQGas {
  public static info() {
    return {
      name: 'MQ2',
    };
  }

  constructor() {
    super();
  }
}
