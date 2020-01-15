import AnalogTemperatureSensor from "../AnalogTemperatureSensor";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
export interface S8120COptions {
}
declare class S8120C extends AnalogTemperatureSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    calc(voltage: any): number;
}
export default S8120C;
