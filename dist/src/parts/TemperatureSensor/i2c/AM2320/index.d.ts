declare class AM2320 {
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
    getAllWait(): Promise<{
        temperature?: undefined;
        humidity?: undefined;
    } | {
        temperature: any;
        humidity: any;
    }>;
    getTempWait(): Promise<any>;
    getHumdWait(): Promise<any>;
}
export default AM2320;
