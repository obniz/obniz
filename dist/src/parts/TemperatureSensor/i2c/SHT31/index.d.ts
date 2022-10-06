/**
 * @packageDocumentation
 * @module Parts.SHT31
 */
import Obniz from '../../../../obniz';
import { PullType } from '../../../../obniz/libs/io_peripherals/common';
import { PeripheralI2C } from '../../../../obniz/libs/io_peripherals/i2c';
import { PeripheralIO } from '../../../../obniz/libs/io_peripherals/io';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../../obniz/ObnizPartsInterface';
import { I2cPartsAbstractOptions } from '../../../i2cParts';
export interface SHT31Options extends I2cPartsAbstractOptions {
    adr: number;
    addressmode: number;
    pull?: PullType;
}
export default class SHT31 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    requiredKeys: string[];
    keys: string[];
    params: any;
    ioKeys: string[];
    commands: any;
    waitTime: {
        [key: string]: number;
    };
    io_adr: PeripheralIO;
    address: number;
    protected obniz: Obniz;
    protected i2c: PeripheralI2C;
    constructor();
    wired(obniz: Obniz): void;
    /**
     * @deprecated
     */
    getData(): Promise<number[]>;
    getDataWait(): Promise<number[]>;
    getTempWait(): Promise<number>;
    getHumdWait(): Promise<number>;
    getHumidWait(): Promise<number>;
    getAllWait(): Promise<{
        temperature: number;
        humidity: number;
    }>;
}
