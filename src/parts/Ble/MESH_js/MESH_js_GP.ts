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

  public notify(data: number[]): void {
    super.notify(data);
    if (data[0] !== this.MessageTypeID) {
      return;
    }
    switch (data[1]) {
      case this.DinEventID:
        if (typeof this.onDinEvent !== 'function') {
          return;
        }
        this.onDinEvent(data[2], data[3]);
        break;
      case this.AinEventID:
        if (typeof this.onAinEvent !== 'function') {
          return;
        }
        this.onAinEvent(data[2], data[3], data[4], data[5]);
        break;
      case this.DinStateID:
        if (typeof this.onDinState !== 'function') {
          return;
        }
        this.onDinState(data[2], data[3], data[4]);
        break;
      case this.AinStateID:
        if (typeof this.onAinState !== 'function') {
          return;
        }
        this.onAinState(data[2], data[3], data[4], data[5]);
        break;
      case this.VoutStateID:
        if (typeof this.onVoutState !== 'function') {
          return;
        }
        this.onVoutState(data[2], data[3], data[4]);
        break;
      case this.DoutStateID:
        if (typeof this.onDoutState !== 'function') {
          return;
        }
        this.onDoutState(data[2], data[3], data[4]);
        break;
      case this.PWMoutStateID:
        if (typeof this.onPWMoutState !== 'function') {
          return;
        }
        this.onPWMoutState(data[2], data[3], data[4]);
        break;
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
    din: number,
    din_notify: number,
    dout: number,
    pwm_ratio: number,
    ain_range_upper: number,
    ain_range_bottom: number,
    ain_notify: number
  ): number[] {
    const HEADER: number[] = [this.MessageTypeID, 1];
    const BODY: number[] = [
      din,
      din_notify,
      dout,
      pwm_ratio,
      1,
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
