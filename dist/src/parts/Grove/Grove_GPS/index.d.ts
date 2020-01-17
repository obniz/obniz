import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface Grove_GPSOptions {
}
declare class Grove_GPS implements ObnizPartsInterface {
    get latitude(): number;
    get longitude(): number;
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    ioKeys: string[];
    displayName: any;
    displayIoNames: any;
    obniz: Obniz;
    params: any;
    uart: any;
    editedData: any;
    gpsInfo: any;
    _latitude: any;
    _longitude: any;
    status: any;
    fixMode: any;
    gpsQuality: any;
    constructor();
    wired(obniz: Obniz): void;
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
export default Grove_GPS;
