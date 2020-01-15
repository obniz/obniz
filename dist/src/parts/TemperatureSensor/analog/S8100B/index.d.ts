import AnalogTemperatureSensor from "../AnalogTemperatureSensor";
import ObnizPartsInterface from "../../../../obniz/ObnizPartsInterface";
export interface S8100BOptions {
}
declare class S8100B extends AnalogTemperatureSensor implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    calc(voltage: any): number;
}
export default S8100B;
