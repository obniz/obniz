/**
 * @packageDocumentation
 * @module Parts.S11059
 */
import Obniz from '../../../obniz';
import { PeripheralI2C } from '../../../obniz/libs/io_peripherals/i2c';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface S11059Options {
    vcc?: number;
    sda?: number;
    scl?: number;
    gnd?: number;
    i2c?: any;
}
export declare type S11059Gain = 0 | 1;
export declare type S11059IntergerTime = 0 | 1 | 2 | 3;
export default class S11059 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    address: number;
    regAdrs: {
        [key: string]: number;
    };
    obniz: Obniz;
    params: any;
    i2c: PeripheralI2C;
    constructor();
    wired(obniz: Obniz): void;
    init(gain: S11059Gain, intergerTime: S11059IntergerTime): void;
    /**
     * @deprecated
     */
    getVal(): Promise<number[]>;
    getValWait(): Promise<number[]>;
}
