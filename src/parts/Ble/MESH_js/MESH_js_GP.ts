import { MESH_js } from '.';
export class MESH_js_GP extends MESH_js {
  public onDinEvent: ((pin: number, state: number) => void) | null = null;
  public onAinEvent:
    | ((pin: number, type: number, threshold: number, level: number) => void)
    | null = null;
  public onDinState:
    | ((requestId: number, pin: number, state: number) => void)
    | null = null;
  public onAinState:
    | ((requestId: number, pin: number, state: number, mode: number) => void)
    | null = null;
  public onVoutState:
    | ((requestId: number, pin: number, state: number) => void)
    | null = null;
  public onDoutState:
    | ((requestId: number, pin: number, state: number) => void)
    | null = null;
  public onPWMoutState:
    | ((requestId: number, pin: number, level: number) => void)
    | null = null;

  private readonly MessageTypeID: number = 1;
  private readonly DinEventID: number = 0;
  private readonly AinEventID: number = 1;
  private readonly DinStateID: number = 2;
  private readonly AinStateID: number = 3;
  private readonly VoutStateID: number = 4;
  private readonly DoutStateID: number = 5;
  private readonly PWMoutStateID: number = 6;

  public readonly VCC = { AUTO: 0, ON: 1, OFF: 2 };
  public readonly AnalogInputEvent = {
    NotNotify: 0,
    OverThreshold: 1,
    InThreshold: 2,
  };
  public readonly Pin = { p1: 0, p2: 1, p3: 2 };
  public readonly Mode = { Always: 0, Once: 1, AlwaysAndOnce: 2 };
  public readonly State = { Low2High: 1, High2Low: 2 };

  public DigitalPins = { p1: false, p2: false, p3: false };

  public notify(data: number[]): void {
    super.notify(data);
    if (data[0] !== this.MessageTypeID) {
      return;
    }
    switch (data[1]) {
      case this.DinEventID: {
        if (typeof this.onDinEvent !== 'function') {
          return;
        }
        const _pin = data[2];
        const _state = data[3];
        this.onDinEvent(_pin, _state);
        break;
      }
      case this.AinEventID: {
        if (typeof this.onAinEvent !== 'function') {
          return;
        }
        const _pin = data[2];
        const _type = data[3];
        const _threshold = data[4];
        const _level = data[5];
        this.onAinEvent(_pin, _type, _threshold, _level);
        break;
      }
      case this.DinStateID: {
        if (typeof this.onDinState !== 'function') {
          return;
        }
        const _request_id = data[2];
        const _pin = data[3];
        const _state = data[4];
        this.onDinState(_request_id, _pin, _state);
        break;
      }
      case this.AinStateID: {
        if (typeof this.onAinState !== 'function') {
          return;
        }
        const _request_id = data[2];
        const _pin = data[3];
        const _state = data[4];
        const _mode = data[5];
        this.onAinState(_request_id, _pin, _state, _mode);
        break;
      }
      case this.VoutStateID: {
        if (typeof this.onVoutState !== 'function') {
          return;
        }
        const _request_id = data[2];
        const _pin = data[3];
        const _state = data[4];
        this.onVoutState(_request_id, _pin, _state);
        break;
      }
      case this.DoutStateID: {
        if (typeof this.onDoutState !== 'function') {
          return;
        }
        const _request_id = data[2];
        const _pin = data[3];
        const _state = data[4];
        this.onDoutState(_request_id, _pin, _state);
        break;
      }
      case this.PWMoutStateID: {
        if (typeof this.onPWMoutState !== 'function') {
          return;
        }
        const _request_id = data[2];
        const _pin = data[3];
        const _level = data[4];
        this.onPWMoutState(_request_id, _pin, _level);
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
    if (pwm_ratio < 0 || 255 < pwm_ratio) {
      this.errorOutOfRange('PWM ratio (' + pwm_ratio + ') must be 0 ~ 255.');
      return [];
    }
    const HEADER: number[] = [this.MessageTypeID, 1];
    const BODY: number[] = [
      (din.p1 ? 1 : 0) + (din.p2 ? 2 : 0) + (din.p3 ? 4 : 0),
      (din_notify.p1 ? 1 : 0) +
        (din_notify.p2 ? 2 : 0) +
        (din_notify.p3 ? 4 : 0),
      (dout.p1 ? 1 : 0) + (dout.p2 ? 2 : 0) + (dout.p3 ? 4 : 0),
      pwm_ratio,
      vcc,
      ain_range_upper,
      ain_range_bottom,
      ain_notify,
    ];
    const data: number[] = HEADER.concat(BODY);
    data.push(this.checkSum(data));
    return data;
  }

  public parseSetDinCommand(pin: number, requestId = 0) {
    return this._parseSetCommand(this.DinStateID, pin, requestId);
  }

  public parseSetAinCommand(mode: number, requestId = 0) {
    return this._parseSetCommand(this.AinStateID, mode, requestId);
  }

  public parseSetVoutCommand(pin: number, requestId = 0) {
    return this._parseSetCommand(this.VoutStateID, pin, requestId);
  }

  public parseSetDoutCommand(pin: number, requestId = 0) {
    return this._parseSetCommand(this.DoutStateID, pin, requestId);
  }

  public parseSetPWMCommand(pin: number, requestId = 0) {
    return this._parseSetCommand(this.PWMoutStateID, pin, requestId);
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
}
