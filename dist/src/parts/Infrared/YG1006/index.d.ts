import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface YG1006Options {
}
declare class YG1006 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    params: any;
    signal: any;
    onchange: any;
    constructor();
    wired(obniz: Obniz): void;
    getWait(): Promise<any>;
}
export default YG1006;
