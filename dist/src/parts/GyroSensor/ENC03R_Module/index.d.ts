/**
 * @packageDocumentation
 * @module Parts.ENC03R_Module
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface ENC03R_ModuleOptions {
    gnd?: number;
    vcc?: number;
    out2: number;
    out1: number;
}
export default class ENC03R_Module implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: any;
    params: any;
    Sens: number;
    sens1: number;
    onchange1?: (val: number) => void;
    sens2: number;
    onchange2?: (val: number) => void;
    protected obniz: Obniz;
    private ad0;
    private ad1;
    constructor();
    wired(obniz: Obniz): void;
    get1Wait(): Promise<number>;
    get2Wait(): Promise<number>;
}
