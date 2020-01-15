import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface AK8963Options {
}
declare class AK8963 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    params: any;
    _address: any;
    i2c: any;
    _adc_cycle: any;
    constructor();
    wired(obniz: Obniz): void;
    setConfig(ADC_cycle: any): void;
    getWait(): Promise<{
        x: any;
        y: any;
        z: any;
    }>;
    char2short(valueH: any, valueL: any): any;
}
export default AK8963;
