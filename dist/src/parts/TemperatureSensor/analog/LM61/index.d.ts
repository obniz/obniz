/**
 * @packageDocumentation
 * @module Parts.LM61
 */
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../../obniz/ObnizPartsInterface';
import AnalogTemperatureSensor, { AnalogTemperatureSensorOptions } from '../AnalogTemperatureSensor';
export declare type LM61Options = AnalogTemperatureSensorOptions;
export default class LM61 extends AnalogTemperatureSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    calc(voltage: any): number;
}
