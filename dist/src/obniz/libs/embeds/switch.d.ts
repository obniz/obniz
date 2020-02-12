/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
declare type ObnizSwitchCallback = (result: boolean) => void;
export default class ObnizSwitch {
    Obniz: any;
    observers: ObnizSwitchCallback[];
    onChangeForStateWait: any;
    state: any;
    onchange: any;
    constructor(Obniz: any);
    _reset(): void;
    addObserver(callback: ObnizSwitchCallback): void;
    getWait(): Promise<unknown>;
    stateWait(isPressed: boolean): Promise<unknown>;
    notified(obj: any): void;
}
export {};
