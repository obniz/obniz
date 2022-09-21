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
    static readonly AnalogInputEventCondition: {
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
        HIGH: 0;
        LOW: 1;
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
     * Verify that the device is MESH block
     *
     * @param name
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(name: string | null, opt_serialnumber?: string): boolean;
    /**
     * Parse data that received from MESH block, and emit event
     *
     * @const
     * @param data
     * @returns void
     */
    notify(data: number[]): void;
    /**
     * Create command of set-mode
     *
     * @param digitalInputLow2High { p1:boolean, p2:boolean, p3:boolean }
     * @param digitalInputHigh2Low { p1:boolean, p2:boolean, p3:boolean }
     * @param digitalOutput { p1:boolean, p2:boolean, p3:boolean }
     * @param pwmRatio 0-255
     * @param vcc Vcc.ON or Vcc.OFF
     * @param analogInputRangeUpper 0-255(0.00-3.00[V])
     * @param analogInputRangeLower 0-255(0.00-3.00[V])
     * @param analogInputNotify AnalogInputEventCondition.NOT_NOTIFY or AnalogInputEventCondition.ABOVE_THRESHOLD or AnalogInputEventCondition.BELOW_THRESHOLD
     * @returns command
     */
    createSetmodeCommand(digitalInputLow2High: GPIO['DigitalPins'], digitalInputHigh2Low: GPIO['DigitalPins'], digitalOutput: GPIO['DigitalPins'], pwmRatio: number, vcc: number, analogInputRangeUpper: number, analogInputRangeLower: number, analogInputNotify: number): number[];
    /**
     * Create command of digital-input
     *
     * @param pin
     * @param opt_requestId
     * @returns command
     */
    createDigitalInputCommand(pin: number, opt_requestId?: number): number[];
    /**
     * Create command of analog-input
     *
     * @param analogInputNotifyMode
     * @param opt_requestId
     * @returns command
     */
    createAnalogInputCommand(analogInputNotifyMode: number, opt_requestId?: number): number[];
    /**
     * Create command of v-output
     *
     * @param opt_requestId
     * @returns command
     */
    createVOutputCommand(opt_requestId?: number): number[];
    /**
     * Create command of digital-output
     *
     * @param pin
     * @param opt_requestId
     * @returns command
     */
    createDigitalOutputCommand(pin: number, opt_requestId?: number): number[];
    /**
     * Create command of PWM
     *
     * @param opt_requestId
     * @returns command
     */
    createPwmCommand(opt_requestId?: number): number[];
    private createCommand_;
    private pin2num_;
}
