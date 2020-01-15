import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface PaPIRsVZOptions {
}
declare class PaPIRsVZ implements ObnizPartsInterface {
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
}
export default PaPIRsVZ;
