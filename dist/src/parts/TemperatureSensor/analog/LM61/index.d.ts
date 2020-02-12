/**
 * @packageDocumentation
 * @module Parts.LM61
 */
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
import AnalogTemperatureSensor, { AnalogTemperatureSensorOptions } from "../AnalogTemperatureSensor";
export interface LM61Options extends AnalogTemperatureSensorOptions {
}
export default class LM61 extends AnalogTemperatureSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    calc(voltage: any): number;
}
