/**
 * @packageDocumentation
 * @module Parts.LM60
 */
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../../obniz/ObnizPartsInterface';
import AnalogTemperatureSensor, { AnalogTemperatureSensorOptions } from '../AnalogTemperatureSensor';
export declare type LM60Options = AnalogTemperatureSensorOptions;
export default class LM60 extends AnalogTemperatureSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    calc(voltage: any): number;
}
