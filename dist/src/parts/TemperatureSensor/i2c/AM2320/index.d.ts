/**
 * @packageDocumentation
 * @module Parts
 */
/**
 * @packageDocumentation
 * @module Parts
 */
import Obniz from "../../../../obniz";
import PeripheralI2C from "../../../../obniz/libs/io_peripherals/i2c";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
import { I2cPartsAbstructOptions } from "../../../i2cParts";
/**
 * @category Parts
 */
export interface AM2320Options extends I2cPartsAbstructOptions {
}
/**
 * @category Parts
 */
export default class AM2320 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    address: any;
    protected obniz: Obniz;
    protected i2c: PeripheralI2C;
    constructor();
    wired(obniz: Obniz): void;
    getAllWait(): Promise<{
        temperature: number;
        humidity: number;
    }>;
    getTempWait(): Promise<number | null>;
    getHumdWait(): Promise<number>;
}
