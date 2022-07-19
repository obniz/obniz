import { MESH_js } from '.';
export declare class MESH_js_GP extends MESH_js {
    onDinEvent: ((pin: number, state: number) => void) | null;
    onAinEvent: ((pin: number, type: number, threshold: number, level: number) => void) | null;
    onDinState: ((requestId: number, pin: number, state: number) => void) | null;
    onAinState: ((requestId: number, pin: number, state: number, mode: number) => void) | null;
    onVoutState: ((requestId: number, pin: number, state: number) => void) | null;
    onDoutState: ((requestId: number, pin: number, state: number) => void) | null;
    onPWMoutState: ((requestId: number, pin: number, level: number) => void) | null;
    private readonly MessageTypeID;
    private readonly DinEventID;
    private readonly AinEventID;
    private readonly DinStateID;
    private readonly AinStateID;
    private readonly VoutStateID;
    private readonly DoutStateID;
    private readonly PWMoutStateID;
    readonly VCC: {
        AUTO: number;
        ON: number;
        OFF: number;
    };
    readonly AnalogInputEvent: {
        NotNotify: number;
        OverThreshold: number;
        InThreshold: number;
    };
    readonly Pin: {
        p1: number;
        p2: number;
        p3: number;
    };
    readonly Mode: {
        Always: number;
        Once: number;
        AlwaysAndOnce: number;
    };
    readonly State: {
        Low2High: number;
        High2Low: number;
    };
    DigitalPins: {
        p1: boolean;
        p2: boolean;
        p3: boolean;
    };
    notify(data: number[]): void;
    /**
     *
     * @param din
     * @param din_notify
     * @param dout
     * @param pwm_ratio
     * @param ain_range_upper
     * @param ain_range_bottom
     * @param ain_notify
     * @returns
     */
    parseSetmodeCommand(din: MESH_js_GP['DigitalPins'], din_notify: MESH_js_GP['DigitalPins'], dout: MESH_js_GP['DigitalPins'], pwm_ratio: number, vcc: number, ain_range_upper: number, ain_range_bottom: number, ain_notify: number): number[];
    parseSetDinCommand(pin: number, requestId?: number): number[];
    parseSetAinCommand(mode: number, requestId?: number): number[];
    parseSetVoutCommand(pin: number, requestId?: number): number[];
    parseSetDoutCommand(pin: number, requestId?: number): number[];
    parseSetPWMCommand(pin: number, requestId?: number): number[];
    private _parseSetCommand;
}
