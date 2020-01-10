declare class Hx711 {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    _offset: any;
    _scale: any;
    obniz: any;
    spi: any;
    params: any;
    sck: any;
    dout: any;
    constructor();
    wired(obniz: any): void;
    readWait(): Promise<number>;
    doubleBit2singleBit(a: any, b: any): number;
    bit(a: any, n: any): 1 | 0;
    readAverageWait(times: any): Promise<number>;
    powerDown(): void;
    powerUp(): void;
    zeroAdjustWait(times: any): Promise<void>;
    getValueWait(times: any): Promise<number>;
    setOffset(offset: any): void;
    setScale(scale: any): void;
}
export default Hx711;
