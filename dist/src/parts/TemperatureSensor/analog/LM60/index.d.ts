import AnalogTemperatureSensor from "../AnalogTemperatureSensor";
export default class LM60 extends AnalogTemperatureSensor {
    static info(): {
        name: string;
    };
    calc(voltage: any): number;
}
