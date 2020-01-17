import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface HMC5883LOptions {
}
declare class HMC5883L implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    address: any;
    obniz: Obniz;
    params: any;
    i2c: any;
    constructor();
    wired(obniz: Obniz): void;
    init(): void;
    get(): Promise<any>;
}
export default HMC5883L;
