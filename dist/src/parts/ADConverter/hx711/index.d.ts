import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface Hx711Options {
    vcc?: number;
    gnd?: number;
    sck: number;
    dout: number;
}
declare class Hx711 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    _offset: any;
    _scale: any;
    obniz: Obniz;
    spi: any;
    params: any;
    sck: any;
    dout: any;
    constructor();
    wired(obniz: Obniz): void;
    readWait(): Promise<number>;
    doubleBit2singleBit(a: number, b: number): number;
    bit(a: number, n: number): 1 | 0;
    readAverageWait(times: any): Promise<number>;
    powerDown(): void;
    powerUp(): void;
    zeroAdjustWait(times: number | any): Promise<void>;
    getValueWait(times: number | any): Promise<number>;
    setOffset(offset: any): void;
    setScale(scale: any): void;
}
export default Hx711;
