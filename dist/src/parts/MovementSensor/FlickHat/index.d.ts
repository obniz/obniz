import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface FlickHatOptions {
}
declare class FlickHat implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    displayIoNames: any;
    obniz: Obniz;
    address: any;
    params: any;
    io_reset: any;
    io_ts: any;
    i2c: any;
    led1: any;
    led2: any;
    onfwinfo: any;
    fwInfo: any;
    rotation: any;
    lastRotation: any;
    readSize: any;
    debugprint: any;
    xyz: any;
    onxyz: any;
    lastGesture: any;
    ongestureall: any;
    ongesture: any;
    lastTouch: any;
    ontouch: any;
    ontap: any;
    ondoubletap: any;
    onairwheel: any;
    statusInfo: any;
    constructor();
    wired(obniz: Obniz): void;
    start(callbackFwInfo: any): Promise<void>;
    _dataArray2string(data: any): any;
    polling(timeout?: any): Promise<void>;
}
export default FlickHat;
