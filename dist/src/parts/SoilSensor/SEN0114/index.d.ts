import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface SEN0114Options {
}
declare class SEN0114 implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    params: any;
    ad: any;
    value: any;
    onchange: any;
    constructor();
    wired(obniz: Obniz): void;
    getHumidityWait(): Promise<any>;
}
export default SEN0114;
