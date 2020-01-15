import Obniz from "../../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
export interface SHT31Options {
}
declare class SHT31 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    requiredKeys: string[];
    keys: string[];
    ioKeys: string[];
    commands: any;
    waitTime: any;
    obniz: Obniz;
    params: any;
    io_adr: any;
    address: any;
    i2c: any;
    constructor();
    wired(obniz: Obniz): void;
    getData(): Promise<any>;
    getTempWait(): Promise<any>;
    getHumdWait(): Promise<any>;
    getAllWait(): Promise<{
        temperature: any;
        humidity: any;
    }>;
}
export default SHT31;
