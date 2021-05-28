/**
 * @packageDocumentation
 * @module Parts.MQ7
 */
import MQGas, { MQGasSensorOptions } from '../MQGas';

export type MQ7Options = MQGasSensorOptions;

export default class MQ7 extends MQGas {
  public static info() {
    return {
      name: 'MQ7',
    };
  }

  constructor() {
    super();
  }
}
