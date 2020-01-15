import AnalogTemperatureSensor from "../AnalogTemperatureSensor";

import Obniz from "../../../../obniz";
import ObnizPartsInterface from "../../../../obniz/ObnizPartsInterface";

export interface LM35DZOptions {
}

class LM35DZ extends AnalogTemperatureSensor implements ObnizPartsInterface {
  public static info() {
    return {
      name: "LM35DZ",
    };
  }

  public calc(voltage: any) {
    return voltage * 100; // Temp(Celsius) = [AD Voltage] * 100l;
  }
}

export default LM35DZ;
