/**
 * @packageDocumentation
 * @module Parts.S8120C
 */
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
import AnalogTemperatureSensor, { AnalogTemperatureSensorOptions } from "../AnalogTemperatureSensor";
/**
 * @category Parts
 */
export interface S8120COptions extends AnalogTemperatureSensorOptions {
}
/**
 * @category Parts
 */
export default class S8120C extends AnalogTemperatureSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    calc(voltage: any): number;
}
