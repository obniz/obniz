export = SHT31;
declare class SHT31 {
    static info(): {
        name: string;
    };
    requiredKeys: string[];
    keys: string[];
    ioKeys: string[];
    commands: {};
    waitTime: {};
    wired(obniz: any): void;
    obniz: any;
    io_adr: any;
    address: number | undefined;
    i2c: any;
    getData(): Promise<any>;
    getTempWait(): Promise<number>;
    getHumdWait(): Promise<number>;
    getAllWait(): Promise<{
        temperature: number;
        humidity: number;
    }>;
}
