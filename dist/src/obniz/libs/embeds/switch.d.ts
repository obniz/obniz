declare class ObnizSwitch {
    Obniz: any;
    observers: any;
    onChangeForStateWait: any;
    state: any;
    onchange: any;
    constructor(Obniz: any);
    _reset(): void;
    addObserver(callback: any): void;
    getWait(): Promise<unknown>;
    stateWait(isPressed: any): Promise<unknown>;
    notified(obj: any): void;
}
export default ObnizSwitch;
