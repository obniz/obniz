import AnalogTemperatureSensor from "../AnalogTemperatureSensor";
declare class S8100B extends AnalogTemperatureSensor {
    static info(): {
        name: string;
    };
    calc(voltage: any): number;
}
export default S8100B;
