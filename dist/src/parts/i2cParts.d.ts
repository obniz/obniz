/**
 * @packageDocumentation
 * @module Parts
 */
import Obniz from "../obniz";
import { PullType } from "../obniz/libs/io_peripherals/common";
import PeripheralI2C from "../obniz/libs/io_peripherals/i2c";
import ObnizPartsInterface from "../obniz/ObnizPartsInterface";
/**
 * @category Parts
 */
export interface I2cPartsAbstructOptions {
    vcc?: number;
    gnd?: number;
    sda?: number;
    scl?: number;
    pull?: PullType;
    clock: number;
    i2c?: PeripheralI2C;
}
/**
 * @category Parts
 */
export default class I2cPartsAbstruct implements ObnizPartsInterface {
    keys: string[];
    requiredKeys: string[];
    i2cinfo: any;
    address: any;
    params: any;
    protected obniz: Obniz;
    protected i2c: PeripheralI2C;
    constructor();
    i2cInfo(): {
        address: number;
        clock: number;
        voltage: string;
    };
    wired(obniz: Obniz): void;
    char2short(val1: number, val2: number): any;
    readWait(command: number, length: number): Promise<number[]>;
    write(command: any, buf: any): void;
}
