import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface JpegSerialCamOptions {
}
declare class JpegSerialCam implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    ioKeys: string[];
    displayName: any;
    displayIoNames: any;
    obniz: Obniz;
    params: any;
    my_tx: any;
    my_rx: any;
    uart: any;
    constructor();
    wired(obniz: Obniz): void;
    _drainUntil(uart: any, search: any, recv?: any): Promise<any>;
    _seekTail(search: any, src: any): number;
    arrayToBase64(array: any): string;
    startWait(obj: any): Promise<void>;
    resetwait(): Promise<void>;
    setSizeWait(resolution: any): Promise<void>;
    setCompressibilityWait(compress: any): Promise<void>;
    setBaudWait(baud: any): Promise<void>;
    takeWait(): Promise<any>;
}
export default JpegSerialCam;
