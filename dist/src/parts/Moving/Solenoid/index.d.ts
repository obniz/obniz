import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface SolenoidOptions {
}
declare class Solenoid implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    params: any;
    io_gnd: any;
    io_signal: any;
    constructor();
    wired(obniz: Obniz): void;
    on(): void;
    off(): void;
    click(time_msec: any): void;
    doubleClick(time_msec: any): void;
}
export default Solenoid;
