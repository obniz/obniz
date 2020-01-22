import Obniz from "../../../../obniz";
import PeripheralI2C from "../../../../obniz/libs/io_peripherals/i2c";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
import { I2cPartsAbstructOptions } from "../../../i2cParts";
export interface SHT20Options extends I2cPartsAbstructOptions {
}
export default class SHT20 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    requiredKeys: string[];
    keys: string[];
    params: any;
    ioKeys: string[];
    commands: {
        [key: string]: [number];
    };
    address: number;
    protected obniz: Obniz;
    protected i2c: PeripheralI2C;
    constructor();
    wired(obniz: Obniz): void;
    getData(command: [number]): Promise<number>;
    getTempWait(): Promise<number>;
    getHumidWait(): Promise<number>;
    private checkCRC;
}
