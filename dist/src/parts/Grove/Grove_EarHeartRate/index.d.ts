import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface Grove_EarHeartRateOptions {
}
declare class Grove_EarHeartRate implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
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
    getWait(): Promise<{}>;
}
export default Grove_EarHeartRate;
