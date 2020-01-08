export = DHT12;
declare class DHT12 {
    static info(): {
        name: string;
    };
    i2cInfo(): {
        address: number;
        clock: number;
        voltage: string;
    };
    getAllDataWait(): Promise<{
        humidity: any;
        temperature: any;
    } | null>;
    getTempWait(): Promise<any>;
    getHumdWait(): Promise<any>;
}
