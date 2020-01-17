import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface S11059Options {
}
declare class S11059 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    address: any;
    regAdrs: any;
    obniz: Obniz;
    params: any;
    i2c: any;
    constructor();
    wired(obniz: Obniz): void;
    init(gain: any, intTime: any): void;
    getVal(): Promise<any>;
}
export default S11059;
