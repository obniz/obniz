import AnalogTemperatureSensor from "../AnalogTemperatureSensor";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
export interface LM61Options {
}
declare class LM61 extends AnalogTemperatureSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    calc(voltage: any): number;
}
export default LM61;
