/**
 * @packageDocumentation
 * @module Parts.S8120C
 */

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
import AnalogTemperatureSensor, { AnalogTemperatureSensorOptions } from "../AnalogTemperatureSensor";

export interface S8120COptions extends AnalogTemperatureSensorOptions {}

export default class S8120C extends AnalogTemperatureSensor implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "S8120C",
    };
  }

  public calc(voltage: any) {
    return (voltage - 1.474) / -0.0082 + 30; // Temp(Celsius) = (([AD Voltage] - [Output Voltage at 30deg])/[V/deg]) + 30
  }
}
