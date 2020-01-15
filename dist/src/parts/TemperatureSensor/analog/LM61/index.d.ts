import AnalogTemperatureSensor from "../AnalogTemperatureSensor";
import ObnizPartsInterface from "../../../../obniz/ObnizPartsInterface";
export interface LM61Options {
}
declare class LM61 extends AnalogTemperatureSensor implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    calc(voltage: any): number;
}
export default LM61;
