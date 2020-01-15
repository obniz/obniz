import Obniz from "../../../../obniz";
import ObnizPartsInterface from "../../../../obniz/ObnizPartsInterface";
export interface D6T44LOptions {
}
declare class D6T44L implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    requiredKeys: string[];
    keys: string[];
    address: any;
    ioKeys: string[];
    commands: any;
    obniz: Obniz;
    params: any;
    i2c: any;
    constructor();
    wired(obniz: Obniz): void;
    getOnePixWait(pixcel: any): Promise<any>;
    getAllPixWait(): Promise<any>;
}
export default D6T44L;
