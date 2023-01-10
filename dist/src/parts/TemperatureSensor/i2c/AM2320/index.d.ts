/**
 * @packageDocumentation
 * @module Parts.AM2320
 */
/**
 * @packageDocumentation
 * @module Parts
 */
import Obniz from '../../../../obniz';
import { PeripheralI2C } from '../../../../obniz/libs/io_peripherals/i2c';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../../obniz/ObnizPartsInterface';
import { I2cPartsAbstractOptions } from '../../../i2cParts';
export declare type AM2320Options = I2cPartsAbstractOptions;
export default class AM2320 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    address: any;
    protected obniz: Obniz;
    protected i2c: PeripheralI2C;
    constructor();
    wired(obniz: Obniz): void;
    getAllWait(): Promise<{
        temperature: number;
        humidity: number;
    }>;
    getTempWait(): Promise<number | null>;
    getHumdWait(): Promise<number>;
    getHumidWait(): Promise<number>;
}
