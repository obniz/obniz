export = AM2320;
declare class AM2320 {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: any[];
    wired(obniz: any): void;
    obniz: any;
    address: number | undefined;
    i2c: any;
    getAllWait(): Promise<{
        temperature?: undefined;
        humidity?: undefined;
    } | {
        temperature: number;
        humidity: number;
    }>;
    getTempWait(): Promise<number | undefined>;
    getHumdWait(): Promise<number | undefined>;
}
