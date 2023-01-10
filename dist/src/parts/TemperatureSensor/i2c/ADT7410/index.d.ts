/**
 * @packageDocumentation
 * @module Parts.ADT7410
 */
import Obniz from '../../../../obniz';
import { PeripheralI2C } from '../../../../obniz/libs/io_peripherals/i2c';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../../obniz/ObnizPartsInterface';
import { I2cPartsAbstractOptions } from '../../../i2cParts';
export interface ADT7410Options extends I2cPartsAbstractOptions {
    addressMode: number;
}
export default class ADT7410 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    address: any;
    protected obniz: Obniz;
    protected i2c: PeripheralI2C;
    constructor();
    wired(obniz: Obniz): void;
    getTempWait(): Promise<number>;
}
