export = ObnizSwitch;
declare class ObnizSwitch {
    constructor(Obniz: any);
    Obniz: any;
    _reset(): void;
    observers: any[] | undefined;
    onChangeForStateWait: (() => void) | undefined;
    addObserver(callback: any): void;
    getWait(): Promise<any>;
    stateWait(isPressed: any): Promise<any>;
    notified(obj: any): void;
    state: any;
}
