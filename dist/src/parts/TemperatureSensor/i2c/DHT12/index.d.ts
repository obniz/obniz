import i2cParts from "../../../i2cParts";
import ObnizPartsInterface from "../../../../obniz/ObnizPartsInterface";
export interface DHT12Options {
}
declare class DHT12 extends i2cParts implements ObnizPartsInterface {
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
export default DHT12;
