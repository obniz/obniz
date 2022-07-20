import { MESH_js } from '.';
import { MESHOutOfRangeError } from './MESH_js_Error';
export class MESH_js_GP extends MESH_js {
  // Event Handler
  public onDigitalInEventNotify:
    | ((pin: number, state: number) => void)
    | null = null;
  public onAnalogInEventNotify:
    | ((pin: number, type: number, threshold: number, level: number) => void)
    | null = null;
  public onDigitalInNotify:
    | ((requestId: number, pin: number, state: number) => void)
    | null = null;
  public onAnalogInNotify:
    | ((requestId: number, pin: number, state: number, mode: number) => void)
    | null = null;
  public onVOutNotify:
    | ((requestId: number, pin: number, state: number) => void)
    | null = null;
  public onDigitalOutNotify:
    | ((requestId: number, pin: number, state: number) => void)
    | null = null;
  public onPwmNotify:
    | ((requestId: number, level: number) => void)
    | null = null;

  public readonly VCC = { AUTO: 0, ON: 1, OFF: 2 } as const;
  public readonly AnalogInputEventCondition = {
    NotNotify: 0,
    OverThreshold: 1,
    InThreshold: 2,
  } as const;
  public readonly Pin = { p1: 0, p2: 1, p3: 2 } as const;
  public readonly Mode = { Always: 0, Once: 1, AlwaysAndOnce: 2 } as const;
  public readonly State = { Low2High: 1, High2Low: 2 } as const;

  public DigitalPins = { p1: false, p2: false, p3: false };

  private readonly MessageTypeID: number = 1 as const;
  private readonly DigitalInEventID: number = 0 as const;
  private readonly AnalogInEventID: number = 1 as const;
  private readonly DigitalInID: number = 2 as const;
  private readonly AnalogInID: number = 3 as const;
  private readonly VOutID: number = 4 as const;
  private readonly DigitalOutID: number = 5 as const;
  private readonly PwmID: number = 6 as const;

  public notify(data: number[]): void {
    super.notify(data);
    if (data[0] !== this.MessageTypeID) {
      return;
    }
    switch (data[1]) {
      case this.DigitalInEventID: {
        if (typeof this.onDigitalInEventNotify !== 'function') {
          return;
        }
        const _pin = data[2];
        const _state = data[3];
        this.onDigitalInEventNotify(_pin, _state);
        break;
      }
      case this.AnalogInEventID: {
        if (typeof this.onAnalogInEventNotify !== 'function') {
          return;
        }
        const _pin = data[2];
        const _type = data[3];
        const _threshold = data[4];
        const _level = data[5];
        this.onAnalogInEventNotify(_pin, _type, _threshold, _level);
        break;
      }
      case this.DigitalInID: {
        if (typeof this.onDigitalInNotify !== 'function') {
          return;
        }
        const _request_id = data[2];
        const _pin = data[3];
        const _state = data[4];
        this.onDigitalInNotify(_request_id, _pin, _state);
        break;
      }
      case this.AnalogInID: {
        if (typeof this.onAnalogInNotify !== 'function') {
          return;
        }
        const _request_id = data[2];
        const _pin = data[3];
        const _state = data[4];
        const _mode = data[5];
        this.onAnalogInNotify(_request_id, _pin, _state, _mode);
        break;
      }
      case this.VOutID: {
        if (typeof this.onVOutNotify !== 'function') {
          return;
        }
        const _request_id = data[2];
        const _pin = data[3];
        const _state = data[4];
        this.onVOutNotify(_request_id, _pin, _state);
        break;
      }
      case this.DigitalOutID: {
        if (typeof this.onDigitalOutNotify !== 'function') {
          return;
        }
        const _request_id = data[2];
        const _pin = data[3];
        const _state = data[4];
        this.onDigitalOutNotify(_request_id, _pin, _state);
        break;
      }
      case this.PwmID: {
        if (typeof this.onPwmNotify !== 'function') {
          return;
        }
        const _request_id = data[2];
        const _level = data[4];
        this.onPwmNotify(_request_id, _level);
        break;
      }
      default:
        break;
    }
  }

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
  public parseSetmodeCommand(
    din: MESH_js_GP['DigitalPins'],
    din_notify: MESH_js_GP['DigitalPins'],
    dout: MESH_js_GP['DigitalPins'],
    pwm_ratio: number,
    vcc: number,
    ain_range_upper: number,
    ain_range_bottom: number,
    ain_notify: number
  ): number[] {
    // Error Handle
    const _PwmMin = 0 as const;
    const _PwmMax = 255 as const;
    if (pwm_ratio < _PwmMin || _PwmMax < pwm_ratio) {
      throw new MESHOutOfRangeError('pwm_ratio', _PwmMin, _PwmMax);
    }

    // Generate Command
    const HEADER = [this.MessageTypeID, 1] as const;
    const BODY = [
      this.pin2num(din),
      this.pin2num(din_notify),
      this.pin2num(dout),
      pwm_ratio,
      vcc,
      ain_range_upper,
      ain_range_bottom,
      ain_notify,
    ] as const;
    const data: number[] = HEADER.concat(BODY);
    data.push(this.checkSum(data));

    return data;
  }

  public parseSetDinCommand(pin: number, requestId = 0) {
    return this._parseSetCommand(this.DigitalInID, pin, requestId);
  }

  public parseSetAinCommand(mode: number, requestId = 0) {
    return this._parseSetCommand(this.AnalogInID, mode, requestId);
  }

  public parseSetVoutCommand(pin: number, requestId = 0) {
    return this._parseSetCommand(this.VOutID, pin, requestId);
  }

  public parseSetDoutCommand(pin: number, requestId = 0) {
    return this._parseSetCommand(this.DigitalOutID, pin, requestId);
  }

  public parseSetPWMCommand(requestId = 0) {
    return this._parseSetCommand(this.PwmID, this.Pin.p3, requestId);
  }

  private _parseSetCommand(
    eventId: number,
    param: number,
    requestId: number
  ): number[] {
    const HEADER: number[] = [this.MessageTypeID, eventId, requestId];
    const data: number[] = HEADER.concat(param);
    data.push(this.checkSum(data));
    return data;
  }

  private pin2num(pins: MESH_js_GP['DigitalPins']): number {
    return (pins.p1 ? 1 : 0) + (pins.p2 ? 2 : 0) + (pins.p3 ? 4 : 0);
  }
}
