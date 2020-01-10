import AnalogTemperatureSensor from "../AnalogTemperatureSensor";
declare class LM35DZ extends AnalogTemperatureSensor {
    static info(): {
        name: string;
    };
    calc(voltage: any): number;
}
export default LM35DZ;
