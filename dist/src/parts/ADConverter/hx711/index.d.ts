import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface Hx711Options {
}
declare class Hx711 implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
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
    doubleBit2singleBit(a: any, b: any): number;
    bit(a: any, n: any): 0 | 1;
    readAverageWait(times: any): Promise<number>;
    powerDown(): void;
    powerUp(): void;
    zeroAdjustWait(times: any): Promise<void>;
    getValueWait(times: any): Promise<number>;
    setOffset(offset: any): void;
    setScale(scale: any): void;
}
export default Hx711;
