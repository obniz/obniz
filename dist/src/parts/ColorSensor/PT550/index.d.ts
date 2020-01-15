import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface PT550Options {
}
declare class PT550 implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
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
export default PT550;
