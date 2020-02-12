/**
 * @packageDocumentation
 * @module Parts.LM35DZ
 */
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
import AnalogTemperatureSensor, { AnalogTemperatureSensorOptions } from "../AnalogTemperatureSensor";
export interface LM35DZOptions extends AnalogTemperatureSensorOptions {
}
export default class LM35DZ extends AnalogTemperatureSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    calc(voltage: any): number;
}
