import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface ENC03R_ModuleOptions {
    gnd?: number;
    vcc?: number;
    out2: number;
    out1: number;
}
declare class ENC03R_Module implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: any;
    Sens: number;
    obniz: Obniz;
    params: any;
    ad0: PeripheralAD;
    ad1: PeripheralAD;
    sens1: any;
    onchange1?: (val: number) => void;
    sens2: any;
    onchange2?: (val: number) => void;
    constructor();
    wired(obniz: Obniz): void;
    get1Wait(): Promise<number>;
    get2Wait(): Promise<number>;
}
export default ENC03R_Module;
