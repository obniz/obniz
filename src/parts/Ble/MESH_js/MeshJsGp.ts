import { MeshJs } from './MeshJs';
import { MeshJsInvalidValueError, MeshJsOutOfRangeError } from './MeshJsError';
export class MeshJsGp extends MeshJs {
  // Event Handler
  public onDigitalInEventNotify:
    | ((pin: number, state: number) => void)
    | null = null;
  public onAnalogInEventNotify: ((level: number) => void) | null = null;
  public onDigitalInNotify:
    | ((requestId: number, pin: number, state: number) => void)
    | null = null;
  public onAnalogInNotify:
    | ((requestId: number, state: number, mode: number) => void)
    | null = null;
  public onVOutNotify:
    | ((requestId: number, state: number) => void)
    | null = null;
  public onDigitalOutNotify:
    | ((requestId: number, pin: number, state: number) => void)
    | null = null;
  public onPwmNotify:
    | ((requestId: number, level: number) => void)
    | null = null;

  public DigitalPins = { p1: false, p2: false, p3: false };

  // Constant Values
  public static readonly ANALOG_IN_EVENT_CONDITION = {
    NOT_NOTIFY: 0 as const,
    ABOVE_THRESHOLD: 1 as const,
    BELOW_THRESHOLD: 2 as const,
  } as const;
  public static readonly MODE = {
    ALWAYS: 0 as const,
    ONCE: 1 as const,
    ALWAYS_AND_ONECE: 2 as const,
  } as const;
  public static readonly PIN = {
    P1: 0 as const,
    P2: 1 as const,
    P3: 2 as const,
  } as const;
  public static readonly STATE = {
    LOW_2_HIGH: 1 as const,
    HIGH_2_LOW: 2 as const,
  } as const;
  public static readonly VCC = {
    AUTO: 0 as const,
    ON: 1 as const,
    OFF: 2 as const,
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
   * notify
   *
   * @const
   * @param data
   * @returns
   */
  public notify(data: number[]): void {
    super.notify(data);
    if (data[0] !== this.MESSAGE_TYPE_ID_) {
      return;
    }
    switch (data[1]) {
      case this.DIGITAL_IN_EVENT_ID_: {
        if (typeof this.onDigitalInEventNotify !== 'function') {
          return;
        }
        const _pin = data[2];
        const _state = data[3];
        this.onDigitalInEventNotify(_pin, _state);
        break;
      }
      case this.ANALOG_IN_EVENT_ID_: {
        if (typeof this.onAnalogInEventNotify !== 'function') {
          return;
        }
        const _level = data[5];
        this.onAnalogInEventNotify(_level);
        break;
      }
      case this.DIGITAL_IN_ID_: {
        if (typeof this.onDigitalInNotify !== 'function') {
          return;
        }
        const requestId = data[2];
        const pin = data[3];
        const state = data[4];
        this.onDigitalInNotify(requestId, pin, state);
        break;
      }
      case this.ANALOG_IN_ID_: {
        if (typeof this.onAnalogInNotify !== 'function') {
          return;
        }
        const requestId = data[2];
        const state = data[4];
        const mode = data[5];
        this.onAnalogInNotify(requestId, state, mode);
        break;
      }
      case this.V_OUT_ID_: {
        if (typeof this.onVOutNotify !== 'function') {
          return;
        }
        const requestId = data[2];
        const state = data[4];
        this.onVOutNotify(requestId, state);
        break;
      }
      case this.DIGITAL_OUT_ID_: {
        if (typeof this.onDigitalOutNotify !== 'function') {
          return;
        }
        const requestId = data[2];
        const pin = data[3];
        const state = data[4];
        this.onDigitalOutNotify(requestId, pin, state);
        break;
      }
      case this.PWM_ID_: {
        if (typeof this.onPwmNotify !== 'function') {
          return;
        }
        const requestId = data[2];
        const level = data[4];
        this.onPwmNotify(requestId, level);
        break;
      }
      default:
        break;
    }
  }

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
  public parseSetmodeCommand(
    digitalIn: MeshJsGp['DigitalPins'],
    digitalInNotify: MeshJsGp['DigitalPins'],
    digitalOut: MeshJsGp['DigitalPins'],
    pwmRatio: number,
    vcc: number,
    analogInRangeUpper: number,
    analogInRangeBottom: number,
    analogInNotify: number
  ): number[] {
    // Error Handle
    const PWM_MIN = 0 as const;
    const PWM_MAX = 255 as const;
    if (pwmRatio < PWM_MIN || PWM_MAX < pwmRatio) {
      throw new MeshJsOutOfRangeError('pwmRatio', PWM_MIN, PWM_MAX);
    }
    if (
      vcc !== MeshJsGp.VCC.AUTO &&
      vcc !== MeshJsGp.VCC.ON &&
      vcc !== MeshJsGp.VCC.OFF
    ) {
      throw new MeshJsInvalidValueError('vcc');
    }
    const ANALOG_IN_RANGE_MIN = 0 as const;
    const ANALOG_IN_RANGE_MAX = 3 as const;
    if (
      analogInRangeUpper < ANALOG_IN_RANGE_MIN ||
      ANALOG_IN_RANGE_MAX < analogInRangeUpper
    ) {
      throw new MeshJsOutOfRangeError(
        'analogInRangeUpper',
        ANALOG_IN_RANGE_MIN,
        ANALOG_IN_RANGE_MAX
      );
    }
    if (
      analogInRangeBottom < ANALOG_IN_RANGE_MIN ||
      ANALOG_IN_RANGE_MAX < analogInRangeBottom
    ) {
      throw new MeshJsOutOfRangeError(
        'analogInRangeBottom',
        ANALOG_IN_RANGE_MIN,
        ANALOG_IN_RANGE_MAX
      );
    }
    if (
      analogInNotify !== MeshJsGp.ANALOG_IN_EVENT_CONDITION.NOT_NOTIFY &&
      analogInNotify !== MeshJsGp.ANALOG_IN_EVENT_CONDITION.ABOVE_THRESHOLD &&
      analogInNotify !== MeshJsGp.ANALOG_IN_EVENT_CONDITION.BELOW_THRESHOLD
    ) {
      throw new MeshJsInvalidValueError('analogInNotify');
    }

    // Generate Command
    const HEADER = [this.MESSAGE_TYPE_ID_, 1] as const;
    const BODY = [
      this.pin2num(digitalIn),
      this.pin2num(digitalInNotify),
      this.pin2num(digitalOut),
      pwmRatio,
      vcc,
      analogInRangeUpper,
      analogInRangeBottom,
      analogInNotify,
    ] as const;
    const data: number[] = HEADER.concat(BODY);
    data.push(this.checkSum(data));

    return data;
  }

  /**
   * parseSetDinCommand
   *
   * @param pin
   * @param requestId
   * @returns
   */
  public parseSetDinCommand(pin: number, requestId = 0) {
    return this.parseSetCommand_(this.DIGITAL_IN_ID_, pin, requestId);
  }

  /**
   * parseSetAinCommand
   *
   * @param mode
   * @param requestId
   * @returns
   */
  public parseSetAinCommand(mode: number, requestId = 0) {
    return this.parseSetCommand_(this.ANALOG_IN_ID_, mode, requestId);
  }

  /**
   * parseSetVoutCommand
   *
   * @param pin
   * @param requestId
   * @returns
   */
  public parseSetVoutCommand(pin: number, requestId = 0) {
    return this.parseSetCommand_(this.V_OUT_ID_, pin, requestId);
  }

  /**
   * parseSetDoutCommand
   *
   * @param pin
   * @param requestId
   * @returns
   */
  public parseSetDoutCommand(pin: number, requestId = 0) {
    return this.parseSetCommand_(this.DIGITAL_OUT_ID_, pin, requestId);
  }

  /**
   * parseSetPWMCommand
   *
   * @param requestId
   * @returns
   */
  public parseSetPWMCommand(requestId = 0) {
    return this.parseSetCommand_(this.PWM_ID_, MeshJsGp.PIN.P3, requestId);
  }

  private parseSetCommand_(
    eventId: number,
    param: number,
    requestId: number
  ): number[] {
    const HEADER: number[] = [this.MESSAGE_TYPE_ID_, eventId, requestId];
    const data: number[] = HEADER.concat(param);
    data.push(this.checkSum(data));
    return data;
  }

  private pin2num(pins: MeshJsGp['DigitalPins']): number {
    return (pins.p1 ? 1 : 0) + (pins.p2 ? 2 : 0) + (pins.p3 ? 4 : 0);
  }
}
