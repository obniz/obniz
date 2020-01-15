import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface IRModuleOptions {
}
declare class IRModule implements ObnizPartsInterface {
    dataSymbolLength: any;
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    params: any;
    sensor: any;
    led: any;
    constructor();
    wired(obniz: Obniz): void;
    send(arr: any): void;
    start(callback: any): void;
    setGetterSetter(partsName: any, varName: any): void;
}
export default IRModule;
