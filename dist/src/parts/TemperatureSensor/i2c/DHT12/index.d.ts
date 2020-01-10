import i2cParts from "../../../i2cParts";
declare class DHT12 extends i2cParts {
    static info(): {
        name: string;
    };
    readWait: any;
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
export default DHT12;
