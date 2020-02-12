/**
 * @packageDocumentation
 * @module Parts.LM35DZ
 */
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../../obniz/ObnizPartsInterface";
import AnalogTemperatureSensor, {AnalogTemperatureSensorOptions} from "../AnalogTemperatureSensor";

/**
 * @category Parts
 */
export interface  LM35DZOptions extends AnalogTemperatureSensorOptions {
}

/**
 * @category Parts
 */
export default class LM35DZ extends AnalogTemperatureSensor implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "LM35DZ",
    };
  }

  public calc(voltage: any) {
    return voltage * 100; // Temp(Celsius) = [AD Voltage] * 100l;
  }
}
