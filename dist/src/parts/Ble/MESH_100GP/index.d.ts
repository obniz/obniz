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
/** MESH_100GP management class */
export default class MESH_100GP extends MESH<MESH_100GP_Data> {
    static readonly PartsName = "MESH_100GP";
    static readonly PREFIX = "MESH-100GP";
    static readonly AnalogInEventCondition: {
        readonly NOT_NOTIFY: 0;
        readonly ABOVE_THRESHOLD: 17;
        readonly BELOW_THRESHOLD: 34;
    };
    static readonly NotifyMode: {
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
    static readonly Vcc: {
        readonly AUTO: 0;
        readonly ON: 1;
        readonly OFF: 2;
    };
    static readonly VccState: {
        readonly OFF: 0;
        readonly ON: 1;
    };
    readonly DigitalPins: MeshJsGp['DigitalPins'];
    onDigitalInputEvent: ((pin: number, state: number) => void) | null;
    onAnalogInputEvent: ((level: number) => void) | null;
    onDigitalInput: ((pin: number, state: number) => void) | null;
    onAnalogInput: ((requestId: number, state: number, mode: number) => void) | null;
    onVOutput: ((requestId: number, state: number) => void) | null;
    onDigitalOutput: ((requestId: number, pin: number, state: number) => void) | null;
    onPwm: ((level: number) => void) | null;
    protected readonly staticClass: typeof MESH_100GP;
    private pin_;
    private state_;
    private pwm_;
    getDataWait(): Promise<{
        name: string;
        address: string;
        battery: number;
    }>;
    getDigitalInputDataWait(pin: number): Promise<number>;
    getPwmDataWait(): Promise<number>;
    /**
     * setMode
     *
     * @param digitalIn {p1:boolean, p2:boolean, p3:boolean}
     * @param digitalInNotify {p1:boolean, p2:boolean, p3:boolean}
     * @param digitalOut {p1:boolean, p2:boolean, p3:boolean}
     * @param pwmRatio 0 ~ 255
     * @param vcc VCC.AUTO or VCC.ON or VCC.OFF
     * @param analogInRangeUpper 0.00 ~ 3.00[V]
     * @param analogInRangeBottom 0.00 ~ 3.00[V]
     * @param analogInNotify AnalogInputEventCondition.NotNotify or AnalogInputEventCondition.AboveThreshold or AnalogInputEventCondition.BelowThreshold
     */
    setMode(digitalIn: MESH_100GP['DigitalPins'], digitalInNotify: MESH_100GP['DigitalPins'], digitalOut: MESH_100GP['DigitalPins'], pwmRatio: number, vcc: number, analogInRangeUpper: number, analogInRangeBottom: number, analogInNotify: number): void;
    setDin(pin: number, opt_requestId?: number): void;
    setAin(mode: number, opt_requestId?: number): void;
    setVout(pin: number, opt_requestId?: number): void;
    setDout(pin: number, opt_requestId?: number): void;
    setPwm(opt_requestId?: number): void;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
    protected getSensorDataWait(requestId: number): Promise<unknown>;
}
