import Obniz from "../../../../obniz";
import ObnizPartsInterface from "../../../../obniz/ObnizPartsInterface";
export interface ADT7410Options {
}
declare class ADT7410 implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    params: any;
    address: any;
    i2c: any;
    constructor();
    wired(obniz: Obniz): void;
    getTempWait(): Promise<number>;
}
export default ADT7410;
