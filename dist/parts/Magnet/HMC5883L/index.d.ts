export = HMC5883L;
declare class HMC5883L {
    static info(): {
        name: string;
    };
    keys: string[];
    address: {};
    wired(obniz: any): void;
    obniz: any;
    i2c: any;
    init(): void;
    get(): Promise<{}>;
}
