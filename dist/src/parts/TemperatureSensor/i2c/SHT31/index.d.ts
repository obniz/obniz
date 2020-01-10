declare class SHT31 {
    static info(): {
        name: string;
    };
    requiredKeys: any;
    keys: any;
    ioKeys: any;
    commands: any;
    waitTime: any;
    obniz: any;
    params: any;
    io_adr: any;
    address: any;
    i2c: any;
    constructor();
    wired(obniz: any): void;
    getData(): Promise<any>;
    getTempWait(): Promise<any>;
    getHumdWait(): Promise<any>;
    getAllWait(): Promise<{
        temperature: any;
        humidity: any;
    }>;
}
export default SHT31;
