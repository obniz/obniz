export = ADT7410;
declare class ADT7410 {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    wired(obniz: any): void;
    obniz: any;
    address: number | undefined;
    i2c: any;
    getTempWait(): Promise<number>;
}
