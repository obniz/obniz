import { Base } from './Base';
export declare class GPIO extends Base {
    /**
     * Digital input event
     */
    onDigitalInputEvent: ((pin: number, state: number) => void) | null;
    /**
     * Analog input event
     */
    onAnalogInputEvent: ((level: number) => void) | null;
    /**
     * Digital input
     */
    onDigitalInput: ((requestId: number, pin: number, state: number) => void) | null;
    /**
     * Analog input
     */
    onAnalogInput: ((requestId: number, level: number, analogInputNotifyMode: number) => void) | null;
    /**
     * VCC output
     */
    onVOutput: ((requestId: number, vccState: number) => void) | null;
    /**
     * Digital output
     */
    onDigitalOutput: ((requestId: number, pin: number, state: number) => void) | null;
    /**
     * PWM output
     */
    onPwm: ((requestId: number, level: number) => void) | null;
    DigitalPins: {
        p1: boolean;
        p2: boolean;
        p3: boolean;
    };
    static readonly AnalogInEventCondition: {
        readonly NOT_NOTIFY: 0;
        readonly ABOVE_THRESHOLD: 17;
        readonly BELOW_THRESHOLD: 34;
    };
    static readonly AnalogInputNotifyMode: {
        readonly STOP: 0;
        readonly ONCE: 1;
        readonly ALWAYS: 2;
    };
    static readonly DigitalInputState: {
        UP_EDGE: 0;
        DOWN_EDGE: 1;
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
     * Parse to set-mode command
     *
     * @param digitalInputLow2High { p1:boolean, p2:boolean, p3:boolean }
     * @param digitalInputHigh2Low { p1:boolean, p2:boolean, p3:boolean }
     * @param digitalOutput { p1:boolean, p2:boolean, p3:boolean }
     * @param pwmRatio 0-255
     * @param vcc Vcc.AUTO or Vcc.ON or Vcc.OFF
     * @param analogInputRangeUpper 0-255(0.00-3.00[V])
     * @param analogInputRangeBottom 0-255(0.00-3.00[V])
     * @param analogInputNotify AnalogInputEventCondition.NotNotify or AnalogInputEventCondition.AboveThreshold or AnalogInputEventCondition.BelowThreshold
     * @returns command
     */
    parseSetmodeCommand(digitalInputLow2High: GPIO['DigitalPins'], digitalInputHigh2Low: GPIO['DigitalPins'], digitalOutput: GPIO['DigitalPins'], pwmRatio: number, vcc: number, analogInputRangeUpper: number, analogInputRangeBottom: number, analogInputNotify: number): number[];
    /**
     * Parse to digital-input command
     *
     * @param pin
     * @param opt_requestId
     * @returns
     */
    parseDigitalInputCommand(pin: number, opt_requestId?: number): number[];
    /**
     * Parse to analog-input command
     *
     * @param analogInputNotifyMode
     * @param opt_requestId
     * @returns
     */
    parseAnalogInputCommand(analogInputNotifyMode: number, opt_requestId?: number): number[];
    /**
     * Parse to v-output command
     *
     * @param opt_requestId
     * @returns
     */
    parseVOutputCommand(opt_requestId?: number): number[];
    /**
     * Parse to digital-output command
     *
     * @param pin
     * @param opt_requestId
     * @returns
     */
    parseDigitalOutputCommand(pin: number, opt_requestId?: number): number[];
    /**
     * Parse to PWM command
     *
     * @param opt_requestId
     * @returns
     */
    parsePwmCommand(opt_requestId?: number): number[];
    private parseCommand_;
    private pin2num_;
}
