import Obniz from "../obniz";
import ObnizPartsInterface from "../obniz/ObnizPartsInterface";
import PeripheralI2C from "../obniz/libs/io_peripherals/i2c";
export interface I2cPartsAbstructOptions {
}
export default class I2cPartsAbstruct implements ObnizPartsInterface {
    keys: string[];
    requiredKeys: string[];
    i2cinfo: any;
    address: any;
    obniz: Obniz;
    params: any;
    i2c: PeripheralI2C;
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
