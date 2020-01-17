import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface FSR40XOptions {
}
declare class FSR40X implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    io_pwr: any;
    params: any;
    ad: any;
    press: any;
    onchange: any;
    constructor();
    wired(obniz: Obniz): void;
    getWait(): Promise<any>;
}
export default FSR40X;
