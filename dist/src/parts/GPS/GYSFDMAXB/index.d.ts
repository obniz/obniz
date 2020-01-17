import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface GYSFDMAXBOptions {
}
declare class GYSFDMAXB implements ObnizPartsInterface {
    get latitude(): number;
    get longitude(): number;
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    ioKeys: string[];
    displayName: any;
    displayIoNames: any;
    obniz: Obniz;
    tx: any;
    params: any;
    rx: any;
    vcc: any;
    gnd: any;
    Opps: any;
    uart: any;
    editedData: any;
    on1pps: any;
    last1pps: any;
    gpsInfo: any;
    self: any;
    _latitude: any;
    _longitude: any;
    status: any;
    fixMode: any;
    gpsQuality: any;
    constructor();
    wired(obniz: Obniz): void;
    start1pps(callback: any): void;
    readSentence(): any;
    getEditedData(): any;
    getGpsInfo(editedData: any): any;
    _mneaTo(format: any, value: any): any;
    latitudeTo(format: any): any;
    longitudeTo(format: any): any;
    status2string(status: any): any;
    fixMode2string(fixMode: any): any;
    gpsQuality2string(gpsQuality: any): any;
    nmea2dms(val: any): string;
    nmea2dm(val: any): string;
    nmea2dd(val: any): number;
    nmea2s(val: any): number;
}
export default GYSFDMAXB;
