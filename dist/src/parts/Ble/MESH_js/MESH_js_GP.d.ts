import { MESH_js } from '.';
export declare class MESH_js_GP extends MESH_js {
    onDigitalInEventNotify: ((pin: number, state: number) => void) | null;
    onAnalogInEventNotify: ((level: number) => void) | null;
    onDigitalInNotify: ((requestId: number, pin: number, state: number) => void) | null;
    onAnalogInNotify: ((requestId: number, state: number, mode: number) => void) | null;
    onVOutNotify: ((requestId: number, state: number) => void) | null;
    onDigitalOutNotify: ((requestId: number, pin: number, state: number) => void) | null;
    onPwmNotify: ((requestId: number, level: number) => void) | null;
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
    DigitalPins: {
        p1: boolean;
        p2: boolean;
        p3: boolean;
    };
    private readonly MessageTypeID;
    private readonly DigitalInEventID;
    private readonly AnalogInEventID;
    private readonly DigitalInID;
    private readonly AnalogInID;
    private readonly VOutID;
    private readonly DigitalOutID;
    private readonly PwmID;
    /**
     * notify
     *
     * @param data
     * @returns
     */
    notify(data: number[]): void;
    /**
     * parseSetmodeCommand
     *
     * @param din {p1:boolean, p2:boolean, p3:boolean}
     * @param din_notify {p1:boolean, p2:boolean, p3:boolean}
     * @param dout {p1:boolean, p2:boolean, p3:boolean}
     * @param pwm_ratio 0 ~ 255
     * @param vcc VCC.AUTO or VCC.ON or VCC.OFF
     * @param ain_range_upper 0.00 ~ 3.00[V], resolution 0.05[V]
     * @param ain_range_bottom 0.00 ~ 3.00[V], resolution 0.05[V]
     * @param ain_notify AnalogInputEventCondition.NotNotify or AnalogInputEventCondition.AboveThreshold or AnalogInputEventCondition.BelowThreshold
     * @returns command
     */
    parseSetmodeCommand(din: MESH_js_GP['DigitalPins'], din_notify: MESH_js_GP['DigitalPins'], dout: MESH_js_GP['DigitalPins'], pwm_ratio: number, vcc: number, ain_range_upper: number, ain_range_bottom: number, ain_notify: number): number[];
    /**
     * parseSetDinCommand
     *
     * @param pin
     * @param requestId
     * @returns
     */
    parseSetDinCommand(pin: number, requestId?: number): number[];
    /**
     * parseSetAinCommand
     *
     * @param mode
     * @param requestId
     * @returns
     */
    parseSetAinCommand(mode: number, requestId?: number): number[];
    /**
     * parseSetVoutCommand
     *
     * @param pin
     * @param requestId
     * @returns
     */
    parseSetVoutCommand(pin: number, requestId?: number): number[];
    /**
     * parseSetDoutCommand
     *
     * @param pin
     * @param requestId
     * @returns
     */
    parseSetDoutCommand(pin: number, requestId?: number): number[];
    /**
     * parseSetPWMCommand
     *
     * @param requestId
     * @returns
     */
    parseSetPWMCommand(requestId?: number): number[];
    private _parseSetCommand;
    private pin2num;
}
