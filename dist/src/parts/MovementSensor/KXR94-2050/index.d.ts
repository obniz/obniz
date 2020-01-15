import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface KXR94_2050Options {
}
declare class KXR94_2050 implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    params: any;
    ad_x: any;
    ad_y: any;
    ad_z: any;
    _x_val: any;
    onChangeX: any;
    onChange: any;
    _y_val: any;
    onChangeY: any;
    _z_val: any;
    onChangeZ: any;
    sensitivity: any;
    offsetVoltage: any;
    constructor();
    wired(obniz: Obniz): void;
    changeVccVoltage(pwrVoltage: any): void;
    voltage2gravity(volt: any): number;
    get(): {
        x: number;
        y: number;
        z: number;
    };
    _get(): {
        x: number;
        y: number;
        z: number;
    };
    getWait(): Promise<{
        x: number;
        y: number;
        z: number;
    }>;
}
export default KXR94_2050;
