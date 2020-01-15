import Obniz from "../../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
export interface AMG8833Options {
}
declare class AMG8833 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    requiredKeys: string[];
    keys: string[];
    ioKeys: string[];
    commands: any;
    obniz: Obniz;
    params: any;
    address: any;
    i2c: any;
    constructor();
    wired(obniz: Obniz): void;
    getOnePixWait(pixel: any): Promise<number>;
    getAllPixWait(): Promise<any>;
}
export default AMG8833;
