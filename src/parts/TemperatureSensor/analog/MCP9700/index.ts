/**
 * @packageDocumentation
 * @module Parts.MCP9700
 */
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
import AnalogTemperatureSensor, { AnalogTemperatureSensorOptions } from "../AnalogTemperatureSensor";

export interface MCP9700Options extends AnalogTemperatureSensorOptions {}

export default class MCP9700 extends AnalogTemperatureSensor implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "MCP9700",
    };
  }

  public calc(voltage: any) {
    return (voltage - 0.5) / 0.01; // Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg])/[Temp coefficient]
  }
}
