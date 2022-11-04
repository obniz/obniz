/**
 * @packageDocumentation
 * @module Parts.S5851A
 */
import Obniz from '../../../../obniz';
import { PeripheralI2C } from '../../../../obniz/libs/io_peripherals/i2c';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../../obniz/ObnizPartsInterface';
export interface S5851AOptions {
    vcc: number;
    gnd: number;
    sda: number;
    scl: number;
    addr0: number;
    addr1: number;
    addressmode: string;
}
export default class S5851A implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    requiredKeys: string[];
    keys: string[];
    io_adr0: any;
    params: any;
    io_adr1: any;
    address: any;
    protected obniz: Obniz;
    protected i2c: PeripheralI2C;
    protected i2c0: PeripheralI2C;
    constructor();
    wired(obniz: Obniz): void;
    getTempWait(): Promise<number>;
    getHumdWait(): Promise<number>;
    getHumidWait(): Promise<number>;
}
