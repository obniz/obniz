declare class ObnizSwitch {
    Obniz: any;
    observers: any;
    onChangeForStateWait: any;
    state: any;
    onchange: any;
    constructor(Obniz: any);
    _reset(): void;
    addObserver(callback: any): void;
    getWait(): Promise<{}>;
    stateWait(isPressed: any): Promise<{}>;
    notified(obj: any): void;
}
export default ObnizSwitch;
