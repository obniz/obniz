import Obniz from "../../../../obniz";
import ObnizPartsInterface from "../../../../obniz/ObnizPartsInterface";
export interface AM2320Options {
}
declare class AM2320 implements ObnizPartsInterface {
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
    getAllWait(): Promise<{
        temperature?: undefined;
        humidity?: undefined;
    } | {
        temperature: any;
        humidity: any;
    }>;
    getTempWait(): Promise<any>;
    getHumdWait(): Promise<any>;
}
export default AM2320;
