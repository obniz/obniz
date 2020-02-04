import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";
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
    conversionDelay: number;
    config_regs: any;
    config: any;
    os: number;
    mode: number;
    dataRate: number;
    pga: number;
    protected obniz: Obniz;
    protected i2c: PeripheralI2C;
    private minCode;
    constructor();
    wired(obniz: Obniz): void;
    getVoltageWait(): Promise<number>;
    setRate(dataRate: number): void;
    setGain(gain: number): void;
    setMode(mode: string): void;
    private getWait;
    private updateConfig;
}
