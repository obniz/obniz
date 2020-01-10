declare class ADT7410 {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    obniz: any;
    params: any;
    address: any;
    i2c: any;
    constructor();
    wired(obniz: any): void;
    getTempWait(): Promise<number>;
}
export default ADT7410;
