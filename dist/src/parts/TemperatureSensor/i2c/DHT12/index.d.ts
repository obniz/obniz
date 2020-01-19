import i2cParts from "../../../i2cParts";
import { I2cPartsAbstructOptions } from "../../../i2cParts";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
export interface DHT12Options extends I2cPartsAbstructOptions {
}
export default class DHT12 extends i2cParts implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    i2cInfo(): {
        address: number;
        clock: number;
        voltage: string;
    };
    getAllDataWait(): Promise<{
        humidity: number;
        temperature: number;
    }>;
    getTempWait(): Promise<number>;
    getHumdWait(): Promise<number>;
}
