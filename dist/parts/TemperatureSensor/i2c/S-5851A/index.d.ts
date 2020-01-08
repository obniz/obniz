export = S5851A;
declare class S5851A {
    static info(): {
        name: string;
    };
    requiredKeys: string[];
    keys: string[];
    wired(obniz: any): void;
    io_adr0: any;
    io_adr1: any;
    address: number | undefined;
    i2c: any;
    getTempWait(): Promise<number>;
    getHumdWait(): Promise<number>;
}
