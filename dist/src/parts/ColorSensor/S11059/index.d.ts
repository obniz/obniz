declare class S11059 {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    address: any;
    regAdrs: any;
    obniz: any;
    params: any;
    i2c: any;
    constructor();
    wired(obniz: any): void;
    init(gain: any, intTime: any): void;
    getVal(): Promise<any>;
}
export default S11059;
