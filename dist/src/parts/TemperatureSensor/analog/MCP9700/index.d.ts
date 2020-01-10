import AnalogTemperatureSensor from "../AnalogTemperatureSensor";
declare class MCP9700 extends AnalogTemperatureSensor {
    static info(): {
        name: string;
    };
    calc(voltage: any): number;
}
export default MCP9700;
