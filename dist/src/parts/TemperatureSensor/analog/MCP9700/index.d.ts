import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
import AnalogTemperatureSensor, { AnalogTemperatureSensorOptions } from "../AnalogTemperatureSensor";
/**
 * @category Parts
 */
export interface MCP9700Options extends AnalogTemperatureSensorOptions {
}
/**
 * @category Parts
 */
export default class MCP9700 extends AnalogTemperatureSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    calc(voltage: any): number;
}
