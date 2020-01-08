export = GYSFDMAXB;
declare class GYSFDMAXB {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    ioKeys: string[];
    displayName: string;
    displayIoNames: {
        txd: string;
        rxd: string;
        Opps: string;
    };
    wired(obniz: any): void;
    obniz: any;
    tx: any;
    rx: any;
    vcc: any;
    gnd: any;
    Opps: any;
    uart: any;
    editedData: {} | undefined;
    on1pps: any;
    last1pps: number | undefined;
    gpsInfo: {} | undefined;
    start1pps(callback: any): void;
    readSentence(): any;
    getEditedData(): {} | undefined;
    getGpsInfo(editedData: any): {} | undefined;
    get latitude(): number;
    get longitude(): number;
    _mneaTo(format: any, value: any): number;
    latitudeTo(format: any): number;
    longitudeTo(format: any): number;
    status2string(status: any): any;
    fixMode2string(fixMode: any): any;
    gpsQuality2string(gpsQuality: any): any;
    nmea2dms(val: any): string;
    nmea2dm(val: any): string;
    nmea2dd(val: any): number;
    nmea2s(val: any): number;
}
