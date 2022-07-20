import { MESH_js } from '.';
export declare class MESH_js_GP extends MESH_js {
    onDigitalInEventNotify: ((pin: number, state: number) => void) | null;
    onAnalogInEventNotify: ((pin: number, type: number, threshold: number, level: number) => void) | null;
    onDigitalInNotify: ((requestId: number, pin: number, state: number) => void) | null;
    onAnalogInNotify: ((requestId: number, pin: number, state: number, mode: number) => void) | null;
    onVOutNotify: ((requestId: number, pin: number, state: number) => void) | null;
    onDigitalOutNotify: ((requestId: number, pin: number, state: number) => void) | null;
    onPwmNotify: ((requestId: number, level: number) => void) | null;
    readonly VCC: {
        readonly AUTO: 0;
        readonly ON: 1;
        readonly OFF: 2;
    };
    readonly AnalogInputEventCondition: {
        readonly NotNotify: 0;
        readonly OverThreshold: 1;
        readonly InThreshold: 2;
    };
    readonly Pin: {
        readonly p1: 0;
        readonly p2: 1;
        readonly p3: 2;
    };
    readonly Mode: {
        readonly Always: 0;
        readonly Once: 1;
        readonly AlwaysAndOnce: 2;
    };
    readonly State: {
        readonly Low2High: 1;
        readonly High2Low: 2;
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
    parseSetPWMCommand(requestId?: number): number[];
    private _parseSetCommand;
    private pin2num;
}
