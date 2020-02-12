/**
 * @packageDocumentation
 * @module Parts
 */
import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
/**
 * @category Parts
 */
export interface HMC5883LOptions {
    gnd?: number;
    sda?: number;
    scl?: number;
    i2c?: PeripheralI2C;
}
/**
 * @category Parts
 */
export default class HMC5883L implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    address: {
        device: number;
        reset: number[];
        xMSB: number[];
    };
    i2c: PeripheralI2C;
    protected obniz: Obniz;
    constructor();
    wired(obniz: Obniz): void;
    init(): void;
    get(): Promise<any>;
}
