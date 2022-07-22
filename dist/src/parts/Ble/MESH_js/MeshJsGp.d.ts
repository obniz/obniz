import { MeshJs } from './MeshJs';
export declare class MeshJsGp extends MeshJs {
    onDigitalInEventNotify: ((pin: number, state: number) => void) | null;
    onAnalogInEventNotify: ((level: number) => void) | null;
    onDigitalInNotify: ((requestId: number, pin: number, state: number) => void) | null;
    onAnalogInNotify: ((requestId: number, state: number, mode: number) => void) | null;
    onVOutNotify: ((requestId: number, state: number) => void) | null;
    onDigitalOutNotify: ((requestId: number, pin: number, state: number) => void) | null;
    onPwmNotify: ((requestId: number, level: number) => void) | null;
    DigitalPins: {
        p1: boolean;
        p2: boolean;
        p3: boolean;
    };
    static readonly ANALOG_IN_EVENT_CONDITION: {
        readonly NOT_NOTIFY: 0;
        readonly ABOVE_THRESHOLD: 1;
        readonly BELOW_THRESHOLD: 2;
    };
    static readonly MODE: {
        readonly ALWAYS: 0;
        readonly ONCE: 1;
        readonly ALWAYS_AND_ONECE: 2;
    };
    static readonly PIN: {
        readonly P1: 0;
        readonly P2: 1;
        readonly P3: 2;
    };
    static readonly STATE: {
        readonly LOW_2_HIGH: 1;
        readonly HIGH_2_LOW: 2;
    };
    static readonly VCC: {
        readonly AUTO: 0;
        readonly ON: 1;
        readonly OFF: 2;
    };
    private readonly MESSAGE_TYPE_ID_;
    private readonly DIGITAL_IN_EVENT_ID_;
    private readonly ANALOG_IN_EVENT_ID_;
    private readonly DIGITAL_IN_ID_;
    private readonly ANALOG_IN_ID_;
    private readonly V_OUT_ID_;
    private readonly DIGITAL_OUT_ID_;
    private readonly PWM_ID_;
    /**
     * notify
     *
     * @const
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
    parseSetmodeCommand(digitalIn: MeshJsGp['DigitalPins'], digitalInNotify: MeshJsGp['DigitalPins'], digitalOut: MeshJsGp['DigitalPins'], pwmRatio: number, vcc: number, analogInRangeUpper: number, analogInRangeBottom: number, analogInNotify: number): number[];
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
    private parseSetCommand_;
    private pin2num;
}
