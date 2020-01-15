import AnalogTemperatureSensor from "../AnalogTemperatureSensor";

import Obniz from "../../../../obniz";
import ObnizPartsInterface from "../../../../obniz/ObnizPartsInterface";

export interface LM60Options {
}

export default class LM60 extends AnalogTemperatureSensor implements ObnizPartsInterface {

  public static info() {
    return {
      name: "LM60",
    };
  }

  public calc(voltage: any) {
    return Math.round(((voltage - 0.424) / 0.00625) * 10) / 10; // Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg(Offset voltage)])/[Temp coefficient]
  }
}
