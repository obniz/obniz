import { Base } from './Base';
import { MESHJsInvalidValueError } from '../util/Error';

export class GPIO extends Base {
  /**
   * Digital input event
   */
  public onDigitalInputEvent:
    | ((pin: number, state: number) => void)
    | null = null;
  /**
   * Analog input event
   */
  public onAnalogInputEvent: ((level: number) => void) | null = null;
  /**
   * Digital input
   */
  public onDigitalInput:
    | ((requestId: number, pin: number, state: number) => void)
    | null = null;
  /**
   * Analog input
   */
  public onAnalogInput:
    | ((
        requestId: number,
        level: number,
        analogInputNotifyMode: number
      ) => void)
    | null = null;
  /**
   * VCC output
   */
  public onVOutput:
    | ((requestId: number, vccState: number) => void)
    | null = null;
  /**
   * Digital output
   */
  public onDigitalOutput:
    | ((requestId: number, pin: number, state: number) => void)
    | null = null;
  /**
   * PWM output
   */
  public onPwm: ((requestId: number, level: number) => void) | null = null;

  public DigitalPins = { p1: false, p2: false, p3: false };

  // Constant Values
  public static readonly AnalogInputEventCondition = {
    NOT_NOTIFY: 0 as const,
    ABOVE_THRESHOLD: 17 as const,
    BELOW_THRESHOLD: 34 as const,
  } as const;
  public static readonly AnalogInputNotifyMode = {
    STOP: 0 as const,
    ONCE: 1 as const,
    ALWAYS: 2 as const,
  } as const;
  public static readonly DigitalInputState = {
    HIGH: 0 as const,
    LOW: 1 as const,
  };
  public static readonly Pin = {
    P1: 0 as const,
    P2: 1 as const,
    P3: 2 as const,
  } as const;
  public static readonly State = {
    LOW_2_HIGH: 1 as const,
    HIGH_2_LOW: 2 as const,
  } as const;
  public static readonly Vcc = {
    ON: 1 as const,
    OFF: 2 as const,
  } as const;
  public static readonly VccState = {
    OFF: 0 as const,
    ON: 1 as const,
  } as const;

  private readonly MESSAGE_TYPE_ID_: number = 1 as const;
  private readonly DIGITAL_IN_EVENT_ID_: number = 0 as const;
  private readonly ANALOG_IN_EVENT_ID_: number = 1 as const;
  private readonly DIGITAL_IN_ID_: number = 2 as const;
  private readonly ANALOG_IN_ID_: number = 3 as const;
  private readonly V_OUT_ID_: number = 4 as const;
  private readonly DIGITAL_OUT_ID_: number = 5 as const;
  private readonly PWM_ID_: number = 6 as const;

  /**
   * Parse data that received from MESH block, and emit event
   *
   * @const
   * @param data
   * @returns
   */
  public notify(data: number[]): void {
    super.notify(data);
    if (data[this.MESSAGE_TYPE_ID_INDEX] !== this.MESSAGE_TYPE_ID_) {
      return;
    }
    const _receivedEventId = data[1];
    switch (_receivedEventId) {
      case this.DIGITAL_IN_EVENT_ID_: {
        if (typeof this.onDigitalInputEvent !== 'function') {
          return;
        }
        const _pin = data[2];
        const _state = data[3];
        this.onDigitalInputEvent(_pin, _state);
        return;
      }
      case this.ANALOG_IN_EVENT_ID_: {
        if (typeof this.onAnalogInputEvent !== 'function') {
          return;
        }
        const _level = data[5];
        this.onAnalogInputEvent(_level);
        return;
      }
      default: {
        break;
      }
    }

    const _requestId = data[2];
    switch (_receivedEventId) {
      case this.DIGITAL_IN_ID_: {
        if (typeof this.onDigitalInput !== 'function') {
          return;
        }
        const pin = data[3];
        const state = data[4];
        this.onDigitalInput(_requestId, pin, state);
        return;
      }
      case this.ANALOG_IN_ID_: {
        if (typeof this.onAnalogInput !== 'function') {
          return;
        }
        const level = data[4];
        const analogInputNotifyMode = data[5];
        this.onAnalogInput(_requestId, level, analogInputNotifyMode);
        return;
      }
      case this.V_OUT_ID_: {
        if (typeof this.onVOutput !== 'function') {
          return;
        }
        const vccState = data[4];
        this.onVOutput(_requestId, vccState);
        return;
      }
      case this.DIGITAL_OUT_ID_: {
        if (typeof this.onDigitalOutput !== 'function') {
          return;
        }
        const pin = data[3];
        const state = data[4];
        this.onDigitalOutput(_requestId, pin, state);
        return;
      }
      case this.PWM_ID_: {
        if (typeof this.onPwm !== 'function') {
          return;
        }
        const level = data[4];
        this.onPwm(_requestId, level);
        return;
      }
      default: {
        break;
      }
    }
  }

  /**
   * Convert parameters to command of set-mode
   *
   * @param digitalInputLow2High { p1:boolean, p2:boolean, p3:boolean }
   * @param digitalInputHigh2Low { p1:boolean, p2:boolean, p3:boolean }
   * @param digitalOutput { p1:boolean, p2:boolean, p3:boolean }
   * @param pwmRatio 0-255
   * @param vcc Vcc.ON or Vcc.OFF
   * @param analogInputRangeUpper 0-255(0.00-3.00[V])
   * @param analogInputRangeBottom 0-255(0.00-3.00[V])
   * @param analogInputNotify AnalogInputEventCondition.NOT_NOTIFY or AnalogInputEventCondition.ABOVE_THRESHOLD or AnalogInputEventCondition.BELOW_THRESHOLD
   * @returns command
   */
  public parseSetmodeCommand(
    digitalInputLow2High: GPIO['DigitalPins'],
    digitalInputHigh2Low: GPIO['DigitalPins'],
    digitalOutput: GPIO['DigitalPins'],
    pwmRatio: number,
    vcc: number,
    analogInputRangeUpper: number,
    analogInputRangeBottom: number,
    analogInputNotify: number
  ): number[] {
    // Error Handle
    const PWM_MIN = 0 as const;
    const PWM_MAX = 255 as const;
    this.checkRange(pwmRatio, PWM_MIN, PWM_MAX, 'pwmRatio');
    if (vcc !== GPIO.Vcc.ON && vcc !== GPIO.Vcc.OFF) {
      throw new MESHJsInvalidValueError('vcc');
    }
    const ANALOG_IN_RANGE_MIN = 0 as const;
    const ANALOG_IN_RANGE_MAX = 255 as const;
    this.checkRange(
      analogInputRangeUpper,
      ANALOG_IN_RANGE_MIN,
      ANALOG_IN_RANGE_MAX,
      'analogInRangeUpper'
    );
    this.checkRange(
      analogInputRangeBottom,
      ANALOG_IN_RANGE_MIN,
      ANALOG_IN_RANGE_MAX,
      'analogInRangeBottom'
    );
    if (
      analogInputNotify !== GPIO.AnalogInputEventCondition.NOT_NOTIFY &&
      analogInputNotify !== GPIO.AnalogInputEventCondition.ABOVE_THRESHOLD &&
      analogInputNotify !== GPIO.AnalogInputEventCondition.BELOW_THRESHOLD
    ) {
      throw new MESHJsInvalidValueError('analogInNotify');
    }

    // Generate Command
    const HEADER = [this.MESSAGE_TYPE_ID_, 1] as const;
    const BODY = [
      this.pin2num_(digitalInputLow2High),
      this.pin2num_(digitalInputHigh2Low),
      this.pin2num_(digitalOutput),
      pwmRatio,
      vcc,
      analogInputRangeUpper,
      analogInputRangeBottom,
      analogInputNotify,
    ] as const;
    const data: number[] = HEADER.concat(BODY);
    data.push(this.checkSum(data));

    return data;
  }

  /**
   * Convert parameters to command of digital-input
   *
   * @param pin
   * @param opt_requestId
   * @returns
   */
  public parseDigitalInputCommand(pin: number, opt_requestId = 0) {
    return this.parseCommand_(this.DIGITAL_IN_ID_, pin, opt_requestId);
  }

  /**
   * Convert parameters to command of analog-input
   *
   * @param analogInputNotifyMode
   * @param opt_requestId
   * @returns
   */
  public parseAnalogInputCommand(
    analogInputNotifyMode: number,
    opt_requestId = 0
  ) {
    return this.parseCommand_(
      this.ANALOG_IN_ID_,
      analogInputNotifyMode,
      opt_requestId
    );
  }

  /**
   * Convert parameters to command of v-output
   *
   * @param opt_requestId
   * @returns
   */
  public parseVOutputCommand(opt_requestId = 0) {
    const PIN = 0; // VOUT pin
    return this.parseCommand_(this.V_OUT_ID_, PIN, opt_requestId);
  }

  /**
   * Convert parameters to command of digital-output
   *
   * @param pin
   * @param opt_requestId
   * @returns
   */
  public parseDigitalOutputCommand(pin: number, opt_requestId = 0) {
    return this.parseCommand_(this.DIGITAL_OUT_ID_, pin, opt_requestId);
  }

  /**
   * Convert parameters to command of PWM
   *
   * @param opt_requestId
   * @returns
   */
  public parsePwmCommand(opt_requestId = 0) {
    return this.parseCommand_(this.PWM_ID_, GPIO.Pin.P3, opt_requestId);
  }

  private parseCommand_(
    eventId: number,
    param: number,
    requestId: number
  ): number[] {
    const HEADER: number[] = [this.MESSAGE_TYPE_ID_, eventId, requestId];
    const data: number[] = HEADER.concat(param);
    data.push(this.checkSum(data));
    return data;
  }

  private pin2num_(pins: GPIO['DigitalPins']): number {
    return (pins.p1 ? 1 : 0) + (pins.p2 ? 2 : 0) + (pins.p3 ? 4 : 0);
  }
}
