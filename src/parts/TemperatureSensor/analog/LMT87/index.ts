import AnalogTemperatureSensor from "../AnalogTemperatureSensor";

import Obniz from "../../../../obniz";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../../obniz/ObnizPartsInterface";

export interface LMT87Options { }
class LMT87 extends AnalogTemperatureSensor implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "LMT87",
    };
  }

  public calc(voltage: any) {
    return (voltage * 1000 - 2365) / -13.6 + 20; // 20-50dc;
  }
}

export default LMT87;
