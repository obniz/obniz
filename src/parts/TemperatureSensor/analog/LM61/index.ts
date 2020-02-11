import ObnizPartsInterface, {ObnizPartsInfo} from "../../../../obniz/ObnizPartsInterface";
import AnalogTemperatureSensor, {AnalogTemperatureSensorOptions} from "../AnalogTemperatureSensor";

/**
 * @category Parts
 */
export interface  LM61Options extends AnalogTemperatureSensorOptions {
}

/**
 * @category Parts
 */
export default class LM61 extends AnalogTemperatureSensor implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "LM61",
    };
  }

  public calc(voltage: any) {
    return Math.round((voltage - 0.6) / 0.01); // Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg(Offset voltage)])/[Temp coefficient]
  }
}
