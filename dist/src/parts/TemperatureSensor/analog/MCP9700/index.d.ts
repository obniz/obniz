import AnalogTemperatureSensor from "../AnalogTemperatureSensor";
import ObnizPartsInterface from "../../../../obniz/ObnizPartsInterface";
export interface MCP9700Options {
}
declare class MCP9700 extends AnalogTemperatureSensor implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    calc(voltage: any): number;
}
export default MCP9700;
