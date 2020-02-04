import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface M5StickC_ADS1100Options {
    vcc?: number;
    gnd?: number;
    sda: number;
    scl: number;
}
export default class M5StickC_ADS1100 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    address: number;
    conversationDelay: number;
    config_regs: any;
    config: any;
    protected obniz: Obniz;
    constructor();
    wired(obniz: Obniz): void;
    private updateConfig;
}
