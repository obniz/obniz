import AnalogTemperatureSensor from "../AnalogTemperatureSensor";

import Obniz from "../../../../obniz";
import ObnizPartsInterface from "../../../../obniz/ObnizPartsInterface";

export interface MCP9700Options { }
class MCP9700 extends AnalogTemperatureSensor implements ObnizPartsInterface {

  public static info() {
    return {
      name: "MCP9700",
    };
  }

  public calc(voltage: any) {
    return (voltage - 0.5) / 0.01; // Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg])/[Temp coefficient]
  }
}

export default MCP9700;
