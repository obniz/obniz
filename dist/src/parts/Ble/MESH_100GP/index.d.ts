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
    static readonly PREFIX = "MESH-100GP";
    static readonly AnalogInputEventCondition: {
        readonly NOT_NOTIFY: 0;
        readonly ABOVE_THRESHOLD: 1;
        readonly BELOW_THRESHOLD: 2;
    };
    static readonly Mode: {
        readonly ALWAYS: 0;
        readonly ONCE: 1;
        readonly ALWAYS_AND_ONECE: 2;
    };
    static readonly Pin: {
        readonly P1: 0;
        readonly P2: 1;
        readonly P3: 2;
    };
    static readonly State: {
        readonly LOW_2_HIGH: 1;
        readonly HIGH_2_LOW: 2;
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
