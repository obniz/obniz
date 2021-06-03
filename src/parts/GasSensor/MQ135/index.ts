/**
 * @packageDocumentation
 * @module Parts.MQ135
 */
import MQGas, { MQGasSensorOptions } from '../MQGas';

export type MQ135Options = MQGasSensorOptions;

export default class MQ135 extends MQGas {
  public static info() {
    return {
      name: 'MQ135',
    };
  }

  constructor() {
    super();
  }
}
