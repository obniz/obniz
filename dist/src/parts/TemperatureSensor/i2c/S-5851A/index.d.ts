declare class S5851A {
    static info(): {
        name: string;
    };
    requiredKeys: any;
    keys: any;
    io_adr0: any;
    params: any;
    io_adr1: any;
    obniz: any;
    address: any;
    i2c: any;
    i2c0: any;
    constructor();
    wired(obniz: any): void;
    getTempWait(): Promise<any>;
    getHumdWait(): Promise<any>;
}
export default S5851A;
