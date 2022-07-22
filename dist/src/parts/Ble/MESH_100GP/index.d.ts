/**
 * @packageDocumentation
 * @module Parts.MESH_100GP
 */
import { MESH } from '../utils/abstracts/MESH';
import { MeshJsGp } from '../MESH_js/MeshJsGp';
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
    static readonly AnalogInputEventCondition: {
        readonly NotNotify: 0;
        readonly AboveThreshold: 1;
        readonly BelowThreshold: 2;
    };
    static readonly Mode: {
        readonly Always: 0;
        readonly Once: 1;
        readonly AlwaysAndOnce: 2;
    };
    static readonly Pin: {
        readonly p1: 0;
        readonly p2: 1;
        readonly p3: 2;
    };
    static readonly State: {
        readonly Low2High: 1;
        readonly High2Low: 2;
    };
    static readonly VCC: {
        readonly AUTO: 0;
        readonly ON: 1;
        readonly OFF: 2;
    };
    readonly DigitalPins: MeshJsGp['DigitalPins'];
    onDigitalInEventNotify: ((pin: number, state: number) => void) | null;
    onAnalogInEventNotify: ((level: number) => void) | null;
    onDigitalInNotify: ((requestId: number, pin: number, state: number) => void) | null;
    onAnalogInNotify: ((requestId: number, state: number, mode: number) => void) | null;
    onVOutNotify: ((requestId: number, state: number) => void) | null;
    onDigitalOutNotify: ((requestId: number, pin: number, state: number) => void) | null;
    onPwmNotify: ((requestId: number, level: number) => void) | null;
    protected readonly staticClass: typeof MESH_100GP;
    getDataWait(): Promise<{
        name: string;
        address: string;
        battery: number;
    }>;
    /**
     * setMode
     *
     * @param din {p1:boolean, p2:boolean, p3:boolean}
     * @param din_notify {p1:boolean, p2:boolean, p3:boolean}
     * @param dout {p1:boolean, p2:boolean, p3:boolean}
     * @param pwm_ratio 0 ~ 255
     * @param vcc VCC.AUTO or VCC.ON or VCC.OFF
     * @param ain_range_upper 0.00 ~ 3.00[V], resolution 0.05[V]
     * @param ain_range_bottom 0.00 ~ 3.00[V], resolution 0.05[V]
     * @param ain_notify AnalogInputEventCondition.NotNotify or AnalogInputEventCondition.AboveThreshold or AnalogInputEventCondition.BelowThreshold
     */
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
