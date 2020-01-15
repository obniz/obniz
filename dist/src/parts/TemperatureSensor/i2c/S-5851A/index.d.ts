import Obniz from "../../../../obniz";
import ObnizPartsInterface from "../../../../obniz/ObnizPartsInterface";
export interface S5851AOptions {
}
declare class S5851A implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    requiredKeys: string[];
    keys: string[];
    io_adr0: any;
    params: any;
    io_adr1: any;
    obniz: Obniz;
    address: any;
    i2c: any;
    i2c0: any;
    constructor();
    wired(obniz: Obniz): void;
    getTempWait(): Promise<any>;
    getHumdWait(): Promise<any>;
}
export default S5851A;
