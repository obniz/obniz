import AnalogTemperatureSensor from "../AnalogTemperatureSensor";

// this not work, but sometimes good
// resason1:too low of obniz input Impedance ?
// resoson2:Is the sensor oscillating?

import Obniz from "../../../../obniz";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../../obniz/ObnizPartsInterface";

export interface S8120COptions { }
class S8120C extends AnalogTemperatureSensor implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "S8120C",
    };
  }

  public calc(voltage: any) {
    return (voltage - 1.474) / -0.0082 + 30; // Temp(Celsius) = (([AD Voltage] - [Output Voltage at 30deg])/[V/deg]) + 30
  }
}

export default S8120C;
