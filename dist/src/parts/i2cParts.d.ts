/**
 * @packageDocumentation
 * @module Parts
 */
import Obniz from '../obniz';
import { DriveType, PullType } from '../obniz/libs/io_peripherals/common';
import { PeripheralI2C } from '../obniz/libs/io_peripherals/i2c';
import { ObnizPartsInterface } from '../obniz/ObnizPartsInterface';
export interface Xyz {
    x: number;
    y: number;
    z: number;
}
export interface I2cPartsAbstractOptions {
    vcc?: number;
    gnd?: number;
    sda?: number;
    scl?: number;
    pull?: PullType;
    clock?: number;
    i2c?: PeripheralI2C;
    voltage?: number;
    address?: number;
}
export interface I2cInfo {
    address: number;
    clock: number;
    voltage: DriveType;
    pull: PullType;
}
export default abstract class I2cPartsAbstract implements ObnizPartsInterface {
    static charArrayToInt16(values: [number, number], endian?: string): number;
    static charArrayToXyz(data: number[], endian?: string, scaleFunc?: (d: number) => number): Xyz;
    keys: string[];
    requiredKeys: string[];
    abstract i2cinfo: I2cInfo;
    address: any;
    params: any;
    protected obniz: Obniz;
    protected i2c: PeripheralI2C;
    constructor();
    i2cInfo(): I2cInfo;
    wired(obniz: Obniz): void;
    char2short(val1: number, val2: number): any;
    readWait(command: number, length: number): Promise<number[]>;
    write(command: any, buf: any): void;
    writeFlagWait(address: number, index: number): Promise<void>;
    clearFlagWait(address: number, index: number): Promise<void>;
    protected readInt16Wait(register: number, endian?: string): Promise<number>;
    protected readThreeInt16Wait(register: number, endian?: string): Promise<[number, number, number]>;
}
