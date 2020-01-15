import AnalogTemperatureSensor from "../AnalogTemperatureSensor";

// sensor resopnse not found

import Obniz from "../../../../obniz";
import ObnizPartsInterface from "../../../../obniz/ObnizPartsInterface";

export interface S8100BOptions { }
class S8100B extends AnalogTemperatureSensor implements ObnizPartsInterface {
  public static info() {
    return {
      name: "S8100B",
    };
  }

  public calc(voltage: any) {
    return 30 + (1.508 - voltage) / -0.08; // Temp(Celsius) =
  }
}

export default S8100B;
