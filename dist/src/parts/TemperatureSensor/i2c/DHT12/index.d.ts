/**
 * @packageDocumentation
 * @module Parts.DHT12
 */
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../../obniz/ObnizPartsInterface';
import i2cParts, { I2cInfo, I2cPartsAbstractOptions } from '../../../i2cParts';
export declare type DHT12Options = I2cPartsAbstractOptions;
export default class DHT12 extends i2cParts implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    i2cinfo: I2cInfo;
    constructor();
    i2cInfo(): I2cInfo;
    getAllDataWait(): Promise<{
        humidity: number;
        temperature: number;
    }>;
    getTempWait(): Promise<number>;
    getHumdWait(): Promise<number>;
    getHumidWait(): Promise<number>;
}
