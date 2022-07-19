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
<<<<<<< HEAD
    /** battery (0 ~ 10) */
=======
>>>>>>> a8042557d (gpio)
    battery: number;
}
/** MESH_100GA management class */
export default class MESH_100GP extends MESH<MESH_100GP_Data> {
    static readonly PartsName = "MESH_100GP";
    static readonly _LocalName = "MESH-100GP";
    readonly DigitalPins: MESH_js_GP['DigitalPins'];
    readonly VCC: MESH_js_GP['VCC'];
    readonly AnalogInputEvent: MESH_js_GP['AnalogInputEvent'];
    readonly Pin: MESH_js_GP['Pin'];
    readonly Mode: MESH_js_GP['Mode'];
    readonly State: MESH_js_GP['State'];
    onDinEvent: ((pin: number, state: number) => void) | null;
    onAinEvent: ((pin: number, type: number, threshold: number, level: number) => void) | null;
    onDinState: ((requestId: number, pin: number, state: number) => void) | null;
    onAinState: ((requestId: number, pin: number, state: number, mode: number) => void) | null;
    onVoutState: ((requestId: number, pin: number, state: number) => void) | null;
    onDoutState: ((requestId: number, pin: number, state: number) => void) | null;
    onPWMoutState: ((requestId: number, pin: number, level: number) => void) | null;
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
    setPWM(pin: number, request_id?: number): void;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
