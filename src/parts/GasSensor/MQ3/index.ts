/**
 * @packageDocumentation
 * @module Parts.MQ3
 */
import MQGas, { MQGasSensorOptions } from '../MQGas';

export type MQ3Options = MQGasSensorOptions;

export default class MQ3 extends MQGas {
  public static info() {
    return {
      name: 'MQ3',
    };
  }

  constructor() {
    super();
  }
}
