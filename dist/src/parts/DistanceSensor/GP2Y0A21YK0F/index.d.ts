import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface GP2Y0A21YK0FOptions {
}
declare class GP2Y0A21YK0F implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    displayIoNames: any;
    _unit: any;
    obniz: Obniz;
    params: any;
    io_signal: any;
    ad_signal: any;
    constructor();
    wired(obniz: Obniz): void;
    start(callback: any): void;
    _volt2distance(val: any): any;
    getWait(): Promise<{}>;
    unit(unit: any): void;
}
export default GP2Y0A21YK0F;
