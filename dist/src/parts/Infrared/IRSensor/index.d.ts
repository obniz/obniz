import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface IRSensorOptions {
}
declare class IRSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    dataSymbolLength: any;
    duration: any;
    dataInverted: any;
    triggerSampleCount: any;
    cutTail: any;
    output_pullup: any;
    obniz: Obniz;
    params: any;
    ondetect: any;
    constructor();
    wired(obniz: Obniz): void;
    start(callback: any): void;
}
export default IRSensor;
