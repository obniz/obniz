/**
 * @packageDocumentation
 * @module Parts.S8120C
 */
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../../obniz/ObnizPartsInterface';
import AnalogTemperatureSensor, { AnalogTemperatureSensorOptions } from '../AnalogTemperatureSensor';
export declare type S8120COptions = AnalogTemperatureSensorOptions;
export default class S8120C extends AnalogTemperatureSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    calc(voltage: any): number;
}
