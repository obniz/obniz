/**
 * @packageDocumentation
 * @module Parts.MCP9701
 */
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
import AnalogTemperatureSensor, { AnalogTemperatureSensorOptions } from "../AnalogTemperatureSensor";
/**
 * @category Parts
 */
export interface MCP9701Options extends AnalogTemperatureSensorOptions {
}
/**
 * @category Parts
 */
export default class MCP9701 extends AnalogTemperatureSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    calc(voltage: any): number;
}
