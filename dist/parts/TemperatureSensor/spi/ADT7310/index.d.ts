export = ADT7310;
declare class ADT7310 {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: any[];
    wired(obniz: any): void;
    obniz: any;
    spi: any;
    getTempWait(): Promise<number>;
}
