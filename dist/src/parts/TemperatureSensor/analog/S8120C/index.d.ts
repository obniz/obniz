import AnalogTemperatureSensor from "../AnalogTemperatureSensor";
declare class S8120C extends AnalogTemperatureSensor {
    static info(): {
        name: string;
    };
    calc(voltage: any): number;
}
export default S8120C;
