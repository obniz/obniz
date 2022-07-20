/**
 * @packageDocumentation
 * @module Parts.MESH_100GP
 */
import { MESH } from '../utils/abstracts/MESH';
import { MESH_js_GP } from '../MESH_js/MESH_js_GP';
export interface MESH_100GPOptions {
}
/**
 * data from MESH_100GP
 */
export interface MESH_100GP_Data {
    name: string;
    address: string;
    battery: number;
}
/** MESH_100GA management class */
export default class MESH_100GP extends MESH<MESH_100GP_Data> {
    static readonly PartsName = "MESH_100GP";
    static readonly _LocalName = "MESH-100GP";
    readonly DigitalPins: MESH_js_GP['DigitalPins'];
    AnalogInputEventCondition: () => {
        readonly NotNotify: 0;
        readonly OverThreshold: 1;
        readonly InThreshold: 2;
    };
    readonly Pin: MESH_js_GP['Pin'];
    Mode: () => {
        readonly Always: 0;
        readonly Once: 1;
        readonly AlwaysAndOnce: 2;
    };
    State: () => {
        readonly Low2High: 1;
        readonly High2Low: 2;
    };
    VCC: () => {
        readonly AUTO: 0;
        readonly ON: 1;
        readonly OFF: 2;
    };
    onDigitalInEventNotify: ((pin: number, state: number) => void) | null;
    onAnalogInEventNotify: ((pin: number, type: number, threshold: number, level: number) => void) | null;
    onDigitalInNotify: ((requestId: number, pin: number, state: number) => void) | null;
    onAnalogInNotify: ((requestId: number, pin: number, state: number, mode: number) => void) | null;
    onVOutNotify: ((requestId: number, pin: number, state: number) => void) | null;
    onDigitalOutNotify: ((requestId: number, pin: number, state: number) => void) | null;
    onPwmNotify: ((requestId: number, level: number) => void) | null;
    protected readonly staticClass: typeof MESH_100GP;
    getDataWait(): Promise<{
        name: string;
        address: string;
        battery: number;
    }>;
    setMode(din: MESH_100GP['DigitalPins'], din_notify: MESH_100GP['DigitalPins'], dout: MESH_100GP['DigitalPins'], pwm_ratio: number, vcc: number, ain_range_upper: number, ain_range_bottom: number, ain_notify: number): void;
    setDin(pin: number, request_id?: number): void;
    setAin(mode: number, request_id?: number): void;
    setVout(pin: number, request_id?: number): void;
    setDout(pin: number, request_id?: number): void;
    setPWMNotify(request_id?: number): void;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
