declare class BleScan {
    scanTarget: any;
    Obniz: any;
    emitter: any;
    scanedPeripherals: any;
    constructor(Obniz: any);
    start(target: any, settings: any): void;
    startOneWait(target: any, settings: any): Promise<unknown>;
    startAllWait(target: any, settings: any): Promise<unknown>;
    end(): void;
    isTarget(peripheral: any): boolean;
    onfinish(scanedPeripherals: any): void;
    onfind(params: any): void;
    notifyFromServer(notifyName: any, params: any): void;
}
export default BleScan;
