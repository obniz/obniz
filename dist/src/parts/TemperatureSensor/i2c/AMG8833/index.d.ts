/**
 * @packageDocumentation
 * @module Parts.AMG8833
 */
import Obniz from '../../../../obniz';
import { PeripheralI2C } from '../../../../obniz/libs/io_peripherals/i2c';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../../obniz/ObnizPartsInterface';
import { I2cPartsAbstractOptions } from '../../../i2cParts';
export interface AMG8833Options extends I2cPartsAbstractOptions {
    address?: number;
}
export default class AMG8833 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    requiredKeys: string[];
    keys: string[];
    ioKeys: string[];
    commands: any;
    params: any;
    address: any;
    protected obniz: Obniz;
    protected i2c: PeripheralI2C;
    constructor();
    wired(obniz: Obniz): void;
    getOnePixWait(pixel: number): Promise<number>;
    getAllPixWait(): Promise<number[]>;
}
