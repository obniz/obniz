import AnalogTemperatureSensor from "../AnalogTemperatureSensor";
import ObnizPartsInterface from "../../../../obniz/ObnizPartsInterface";
export interface LM60Options {
}
export default class LM60 extends AnalogTemperatureSensor implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    calc(voltage: any): number;
}
