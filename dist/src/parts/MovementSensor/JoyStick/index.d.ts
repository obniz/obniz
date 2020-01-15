import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface JoyStickOptions {
}
declare class JoyStick implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    pins: any;
    pinname: any;
    shortName: any;
    obniz: Obniz;
    params: any;
    io_sig_sw: any;
    ad_x: any;
    ad_y: any;
    positionX: any;
    positionY: any;
    onchangex: any;
    onchangey: any;
    isPressed: any;
    onchangesw: any;
    constructor();
    wired(obniz: Obniz): void;
    isPressedWait(): Promise<boolean>;
    getXWait(): Promise<number>;
    getYWait(): Promise<number>;
}
export default JoyStick;
