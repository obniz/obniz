import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface USBOptions {
}
declare class USB implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    displayIoNames: any;
    obniz: Obniz;
    io_vdd: any;
    params: any;
    io_gnd: any;
    constructor();
    wired(obniz: Obniz): void;
    on(): void;
    off(): void;
}
export default USB;
