declare class ADT7310 {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    obniz: any;
    params: any;
    spi: any;
    constructor();
    wired(obniz: any): void;
    getTempWait(): Promise<number>;
}
export default ADT7310;
