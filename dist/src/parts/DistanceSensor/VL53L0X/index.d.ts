/**
 * @packageDocumentation
 * @module Parts.VL53L0X
 */
import Obniz from '../../../obniz';
import { PeripheralI2C } from '../../../obniz/libs/io_peripherals/i2c';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import { I2cPartsAbstractOptions } from '../../i2cParts';
export declare type VL53L0XOptions = I2cPartsAbstractOptions;
export default class VL53L0X implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    requiredKeys: string[];
    keys: string[];
    params: any;
    address: number;
    regs: any;
    acnt: number;
    scnt: number;
    status: number;
    protected obniz: Obniz;
    protected i2c: PeripheralI2C;
    constructor();
    wired(obniz: Obniz): void;
    getWait(): Promise<number | null>;
    private makeuint16;
}
