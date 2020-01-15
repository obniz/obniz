import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface ENC03R_ModuleOptions {
}
declare class ENC03R_Module implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: any;
    Sens: any;
    obniz: Obniz;
    params: any;
    ad0: any;
    ad1: any;
    sens1: any;
    onchange1: any;
    sens2: any;
    onchange2: any;
    constructor();
    wired(obniz: Obniz): void;
    get1Wait(): Promise<{}>;
    get2Wait(): Promise<{}>;
}
export default ENC03R_Module;
