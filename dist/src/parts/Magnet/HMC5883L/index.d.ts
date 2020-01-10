declare class HMC5883L {
    static info(): {
        name: string;
    };
    keys: any;
    address: any;
    obniz: any;
    params: any;
    i2c: any;
    constructor();
    wired(obniz: any): void;
    init(): void;
    get(): Promise<any>;
}
export default HMC5883L;
