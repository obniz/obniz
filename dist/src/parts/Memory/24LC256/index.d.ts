import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface _24LC256Options {
}
declare class _24LC256 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    requiredKeys: string[];
    keys: string[];
    params: any;
    i2c: any;
    obniz: Obniz;
    constructor();
    wired(obniz: Obniz): void;
    set(address: any, data: any): void;
    getWait(address: any, length: any): Promise<any>;
}
export default _24LC256;
