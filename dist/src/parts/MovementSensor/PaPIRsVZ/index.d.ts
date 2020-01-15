import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface PaPIRsVZOptions {
}
declare class PaPIRsVZ implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    io_signal: any;
    params: any;
    onchange: any;
    constructor();
    wired(obniz: Obniz): void;
}
export default PaPIRsVZ;
