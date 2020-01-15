import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface FullColorLEDOptions {
}
declare class FullColorLED implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    COMMON_TYPE_ANODE: any;
    COMMON_TYPE_CATHODE: any;
    anode_keys: any;
    cathode_keys: any;
    animationName: any;
    keys: string[];
    requiredKeys: string[];
    params: any;
    obniz: Obniz;
    commontype: any;
    common: any;
    pwmR: any;
    pwmG: any;
    pwmB: any;
    constructor();
    wired(obniz: Obniz): void;
    rgb(r: any, g: any, b: any): void;
    hsv(h: any, s: any, v: any): void;
    gradation(cycletime_ms: any): void;
    stopgradation(): void;
}
export default FullColorLED;
