/**
 * @packageDocumentation
 * @module Parts.LM35DZ
 */
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
import AnalogTemperatureSensor, { AnalogTemperatureSensorOptions } from "../AnalogTemperatureSensor";

export interface LM35DZOptions extends AnalogTemperatureSensorOptions {}

export default class LM35DZ extends AnalogTemperatureSensor implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "LM35DZ",
    };
  }

  private temperature: number = 0;
  private tempArray: number[] = new Array(100);
  private sum: number = 0;
  private init_count: number = 0;
  private count: number = 0;

  public calc(voltage: any) {
    this.temperature = voltage * 100; // Temp(Celsius) = [AD Voltage] * 100;

    if (this.init_count < 100) {
      // initialization
      this.tempArray[this.init_count] = this.temperature;
      this.sum += this.temperature;
      this.init_count++;
      return this.sum / this.init_count;
    } else {
      // moving average
      if (this.count === 100) {
        this.count = 0;
      }
      this.sum -= this.tempArray[this.count]; // remove oldest temperature data
      this.tempArray[this.count] = this.temperature; // overwrite oldest temperature data to newest
      this.sum += this.temperature; // add newest temperature data
      this.count++;
      return this.sum / 100;
    }
  }
}
