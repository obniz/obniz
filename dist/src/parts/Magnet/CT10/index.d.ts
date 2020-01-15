import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface CT10Options {
}
declare class CT10 implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    onChangeForStateWait: any;
    io_signal: any;
    params: any;
    io_vcc: any;
    io_supply: any;
    isNear: any;
    onchange: any;
    constructor();
    wired(obniz: Obniz): void;
    isNearWait(): Promise<any>;
    stateWait(isNear: any): Promise<{}>;
}
export default CT10;
