import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface AnalogTemperatureSensorOptions {
}
declare class AnalogTemperatureSensor implements ObnizPartsInterface {
    keys: string[];
    requiredKeys: string[];
    drive: any;
    obniz: Obniz;
    params: any;
    ad: any;
    temp: any;
    constructor();
    wired(obniz: Obniz): void;
    getWait(): Promise<any>;
    onchange(temp: any): void;
    calc(voltage: any): number;
}
export default AnalogTemperatureSensor;
