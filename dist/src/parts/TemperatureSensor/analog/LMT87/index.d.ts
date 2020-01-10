import AnalogTemperatureSensor from "../AnalogTemperatureSensor";
declare class LMT87 extends AnalogTemperatureSensor {
    static info(): {
        name: string;
    };
    calc(voltage: any): number;
}
export default LMT87;
