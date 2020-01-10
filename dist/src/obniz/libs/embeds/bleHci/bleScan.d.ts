declare class BleScan {
    scanTarget: any;
    scanSettings: any;
    obnizBle: any;
    emitter: any;
    scanedPeripherals: any;
    _timeoutTimer: any;
    constructor(obnizBle: any);
    start(target: any, settings: any): void;
    startOneWait(target: any, settings: any): Promise<{}>;
    startAllWait(target: any, settings: any): Promise<{}>;
    end(): void;
    isTarget(peripheral: any): boolean;
    onfinish(data: any): void;
    onfind(params: any): void;
    notifyFromServer(notifyName: any, params: any): void;
    clearTimeoutTimer(): void;
}
export default BleScan;
