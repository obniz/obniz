/**
 * @packageDocumentation
 * @module Parts.GYSFDMAXB
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface GYSFDMAXBOptions {
    vcc?: number;
    gnd?: number;
    txd: number;
    rxd: number;
    Opps?: number;
}
export interface GYSFDMAXBEditedData {
    enable: boolean;
    GPGGA: any[];
    GPGLL: any[];
    GPGSA: any[];
    GPGSV: any[];
    GPRMC: any[];
    GPVTG: any[];
    GPZDA: any[];
    [key: string]: any;
    timestamp: Date;
}
export default class GYSFDMAXB implements ObnizPartsInterface {
    get latitude(): number;
    get longitude(): number;
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    ioKeys: string[];
    displayName: string;
    displayIoNames: {
        txd: string;
        rxd: string;
        Opps: string;
    };
    params: any;
    editedData: any;
    on1pps: (() => void) | null;
    last1pps: number;
    gpsInfo: any;
    status: any;
    fixMode: any;
    gpsQuality: any;
    protected obniz: Obniz;
    private tx;
    private rx;
    private vcc;
    private gnd;
    private Opps;
    private uart;
    private _latitude;
    private _longitude;
    constructor();
    wired(obniz: Obniz): void;
    start1pps(callback: (() => void) | null): void;
    readSentence(): any;
    getEditedData(): GYSFDMAXBEditedData;
    getGpsInfo(editedData?: GYSFDMAXBEditedData): any;
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
