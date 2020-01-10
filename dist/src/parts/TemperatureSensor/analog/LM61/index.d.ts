import AnalogTemperatureSensor from "../AnalogTemperatureSensor";
declare class LM61 extends AnalogTemperatureSensor {
    static info(): {
        name: string;
    };
    calc(voltage: any): number;
}
export default LM61;
