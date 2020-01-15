import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface HCSR505Options {
}
declare class HCSR505 implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    io_signal: any;
    params: any;
    onchange: any;
    constructor();
    wired(obniz: Obniz): void;
    getWait(): any;
}
export default HCSR505;
