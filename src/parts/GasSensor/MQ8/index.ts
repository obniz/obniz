/**
 * @packageDocumentation
 * @module Parts.MQ8
 */
import MQGas, { MQGasSensorOptions } from '../MQGas';

export type MQ8Options = MQGasSensorOptions;

export default class MQ8 extends MQGas {
  public static info() {
    return {
      name: 'MQ8',
    };
  }

  constructor() {
    super();
  }
}
