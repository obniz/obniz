/**
 * @packageDocumentation
 * @module Parts.Grove_GPS
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface Grove_GPSOptions {
    vcc?: number;
    gnd?: number;
    tx: number;
    rx: number;
}
export interface Grove_GPSEditedData {
    enable: boolean;
    GPGGA: any;
    GPGLL: any;
    GPGSA: any;
    GPGSV: any[];
    GPRMC: any;
    GPVTG: any;
    GPZDA: any;
    [key: string]: any;
    timestamp: Date;
}
export default class Grove_GPS implements ObnizPartsInterface {
    get latitude(): number;
    get longitude(): number;
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    ioKeys: string[];
    displayName: any;
    displayIoNames: any;
    params: any;
    editedData: any;
    gpsInfo: any;
    status: any;
    fixMode: any;
    gpsQuality: any;
    protected obniz: Obniz;
    private uart;
    private _latitude;
    private _longitude;
    constructor();
    wired(obniz: Obniz): void;
    readSentence(): string;
    getEditedData(): Grove_GPSEditedData;
    getGpsInfo(editedData?: Grove_GPSEditedData): any;
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
