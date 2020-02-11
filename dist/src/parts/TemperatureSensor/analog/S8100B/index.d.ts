import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
import AnalogTemperatureSensor, { AnalogTemperatureSensorOptions } from "../AnalogTemperatureSensor";
/**
 * @category Parts
 */
export interface S8100BOptions extends AnalogTemperatureSensorOptions {
}
/**
 * @category Parts
 */
export default class S8100B extends AnalogTemperatureSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    calc(voltage: any): number;
}
