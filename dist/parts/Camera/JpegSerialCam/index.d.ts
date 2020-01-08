export = JpegSerialCam;
declare class JpegSerialCam {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    ioKeys: string[];
    displayName: string;
    displayIoNames: {
        cam_tx: string;
        cam_rx: string;
    };
    wired(obniz: any): void;
    obniz: any;
    my_tx: any;
    my_rx: any;
    uart: any;
    _drainUntil(uart: any, search: any, recv: any): Promise<any>;
    _seekTail(search: any, src: any): number;
    arrayToBase64(array: any): string;
    startWait(obj: any): Promise<void>;
    resetwait(): Promise<void>;
    setSizeWait(resolution: any): Promise<void>;
    setCompressibilityWait(compress: any): Promise<void>;
    setBaudWait(baud: any): Promise<void>;
    takeWait(): Promise<any>;
}
