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
    public static info(): ObnizPartsInfo;
    public keys: string[];
    public requiredKeys: any;
    public Sens: number;
    public obniz: Obniz;
    public params: any;
    public ad0: PeripheralAD;
    public ad1: PeripheralAD;
    public sens1: any;
    public onchange1?: (val: number) => void;
    public sens2: any;
    public onchange2?: (val: number) => void;
    constructor();
    public wired(obniz: Obniz): void;
    public get1Wait(): Promise<number>;
    public get2Wait(): Promise<number>;
}
export default ENC03R_Module;
