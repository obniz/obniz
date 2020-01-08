export = BleScan;
declare class BleScan {
    constructor(obnizBle: any);
    scanTarget: any;
    scanSettings: {};
    obnizBle: any;
    emitter: import("eventemitter3")<string | symbol>;
    scanedPeripherals: any[];
    _timeoutTimer: NodeJS.Timeout | null;
    start(target: any, settings: any): void;
    startOneWait(target: any, settings: any): Promise<any>;
    startAllWait(target: any, settings: any): Promise<any>;
    end(): void;
    isTarget(peripheral: any): boolean;
    onfinish(): void;
    onfind(): void;
    notifyFromServer(notifyName: any, params: any): void;
    clearTimeoutTimer(): void;
}
