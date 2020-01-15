import AnalogTemperatureSensor from "../AnalogTemperatureSensor";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
export interface LM35DZOptions {
}
declare class LM35DZ extends AnalogTemperatureSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    calc(voltage: any): number;
}
export default LM35DZ;
