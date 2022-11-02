/**
 * @packageDocumentation
 * @module Parts.S8100B
 */

import {
  ObnizPartsInterface,
  ObnizPartsInfo,
} from '../../../../obniz/ObnizPartsInterface';
import AnalogTemperatureSensor, {
  AnalogTemperatureSensorOptions,
} from '../AnalogTemperatureSensor';

export type S8100BOptions = AnalogTemperatureSensorOptions;

export default class S8100B
  extends AnalogTemperatureSensor
  implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: 'S8100B',
    };
  }

  public calc(voltage: any) {
    return 30 + (1.508 - voltage) / -0.08; // Temp(Celsius) =
  }
}
