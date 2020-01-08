export = Grove_GPS;
declare class Grove_GPS {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    ioKeys: string[];
    displayName: string;
    displayIoNames: {
        tx: string;
        rx: string;
    };
    wired(obniz: any): void;
    obniz: any;
    uart: any;
    editedData: {} | undefined;
    gpsInfo: {} | undefined;
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
