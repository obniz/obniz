/**
 * @packageDocumentation
 * @module Parts.MQ6
 */
import MQGas, { MQGasSensorOptions } from '../MQGas';

export type MQ6Options = MQGasSensorOptions;

export default class MQ6 extends MQGas {
  public static info() {
    return {
      name: 'MQ6',
    };
  }

  constructor() {
    super();
  }
}
