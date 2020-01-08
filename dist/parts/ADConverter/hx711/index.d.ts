export = hx711;
declare class hx711 {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    _offset: number;
    _scale: number;
    wired(obniz: any): void;
    obniz: any;
    spi: any;
    sck: any;
    dout: any;
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
