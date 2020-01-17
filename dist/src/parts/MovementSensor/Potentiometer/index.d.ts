import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface PotentiometerOptions {
}
declare class Potentiometer implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    vcc_voltage: any;
    obniz: Obniz;
    params: any;
    ad: any;
    position: any;
    onchange: any;
    constructor();
    wired(obniz: Obniz): void;
}
export default Potentiometer;
