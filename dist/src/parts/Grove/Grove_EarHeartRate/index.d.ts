import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface Grove_EarHeartRateOptions {
}
declare class Grove_EarHeartRate implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    displayIoNames: any;
    interval: any;
    duration: any;
    obniz: Obniz;
    params: any;
    constructor();
    wired(obniz: Obniz): void;
    start(callback: any): void;
    getWait(): Promise<unknown>;
}
export default Grove_EarHeartRate;
