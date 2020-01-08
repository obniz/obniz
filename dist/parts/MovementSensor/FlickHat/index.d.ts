export = FlickHat;
declare class FlickHat {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    displayIoNames: {
        sda: string;
        scl: string;
        gnd: string;
        reset: string;
        ts: string;
    };
    wired(obniz: any): void;
    obniz: any;
    address: number | undefined;
    io_reset: any;
    io_ts: any;
    i2c: any;
    led1: any;
    led2: any;
    start(callbackFwInfo: any): Promise<void>;
    onfwinfo: any;
    fwInfo: {
        fwValid: number;
        fwInfoReceived: boolean;
        hwRev?: undefined;
        paramStartAddr?: undefined;
        libLoaderVer?: undefined;
        libLoaderPlatform?: undefined;
        fwStartAddr?: undefined;
        fwVersion?: undefined;
    } | {
        fwValid: boolean;
        hwRev: any[];
        paramStartAddr: number;
        libLoaderVer: any[];
        libLoaderPlatform: any;
        fwStartAddr: number;
        fwVersion: string;
        fwInfoReceived: boolean;
    } | undefined;
    rotation: number | undefined;
    lastRotation: any;
    readSize: number | undefined;
    _dataArray2string(data: any): string;
    polling(timeout: any): Promise<void>;
    xyz: {
        x: number;
        y: number;
        z: number;
        seq: any;
    } | undefined;
    lastGesture: any;
    lastTouch: number | undefined;
    statusInfo: {
        msgId: any;
        maxCmdSize: any;
        error: number;
    } | undefined;
}
