/**
 * @packageDocumentation
 * @module Parts.LMT87
 */
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
import AnalogTemperatureSensor, { AnalogTemperatureSensorOptions } from "../AnalogTemperatureSensor";

export interface LMT87Options extends AnalogTemperatureSensorOptions {}

export default class LMT87 extends AnalogTemperatureSensor implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "LMT87",
    };
  }

  public calc(voltage: any) {
    return (voltage * 1000 - 2365) / -13.6 + 20; // 20-50dc;
  }
}
