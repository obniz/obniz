/**
 * @packageDocumentation
 * @module Parts.24LC256
 */
import Obniz from '../../../obniz';
import { PeripheralI2C } from '../../../obniz/libs/io_peripherals/i2c';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface _24LC256Options {
    sda?: number;
    scl?: number;
    clock?: number;
    pull?: string;
    i2c?: PeripheralI2C;
    address?: number;
}
export default class _24LC256 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    requiredKeys: string[];
    keys: string[];
    params: any;
    protected obniz: Obniz;
    private i2c;
    constructor();
    wired(obniz: Obniz): void;
    set(address: number, data: number[]): void;
    getWait(address: number, length: number): Promise<number[]>;
}
