export = S11059;
declare class S11059 {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: any[];
    address: number;
    regAdrs: {};
    wired(obniz: any): void;
    obniz: any;
    i2c: any;
    init(gain: any, intTime: any): void;
    getVal(): Promise<number[]>;
}
