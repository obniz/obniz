import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface HCSR04Options {
}
declare class HCSR04 implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    _unit: any;
    reset_alltime: any;
    temp: any;
    obniz: Obniz;
    params: any;
    vccIO: any;
    trigger: any;
    echo: any;
    constructor();
    wired(obniz: Obniz): void;
    measure(callback: any): void;
    measureWait(): Promise<{}>;
    unit(unit: any): void;
}
export default HCSR04;
