declare class JpegSerialCam {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    ioKeys: any;
    displayName: any;
    displayIoNames: any;
    obniz: any;
    params: any;
    my_tx: any;
    my_rx: any;
    uart: any;
    constructor();
    wired(obniz: any): void;
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
