/**
 * @packageDocumentation
 * @module Parts.MESH_100GP
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { MeshJsGp } from '../MESH_js/MeshJsGp';
import { MeshJsTimeOutError } from '../MESH_js/MeshJsError';

export interface MESH_100GPOptions {}

/**
 * data from MESH_100GP
 */
export interface MESH_100GP_Data {
  name: string; // device name
  address: string; // bluetooth address
  battery: number; // battery (0 ~ 10)
}

/** MESH_100GP management class */
export default class MESH_100GP extends MESH<MESH_100GP_Data> {
  public static readonly PartsName = 'MESH_100GP';
  public static readonly PREFIX = 'MESH-100GP';

  public static readonly AnalogInEventCondition =
    MeshJsGp.AnalogInEventCondition;
  public static readonly NotifyMode = MeshJsGp.NotifyMode;
  public static readonly Pin = MeshJsGp.Pin;
  public static readonly State = MeshJsGp.State;
  public static readonly Vcc = MeshJsGp.Vcc;
  public static readonly VccState = MeshJsGp.VccState;

  public readonly DigitalPins: MeshJsGp['DigitalPins'] = (this
    .meshBlock as MeshJsGp).DigitalPins;

  // Event Handler
  public onDigitalInputEvent:
    | ((pin: number, state: number) => void)
    | null = null;
  public onAnalogInputEvent: ((level: number) => void) | null = null;
  public onDigitalInput: ((pin: number, state: number) => void) | null = null;
  public onAnalogInput:
    | ((requestId: number, state: number, mode: number) => void)
    | null = null;
  public onVOutput: ((requestId: number, state: number) => void) | null = null;
  public onDigitalOutput:
    | ((requestId: number, pin: number, state: number) => void)
    | null = null;
  public onPwm: ((level: number) => void) | null = null;

  protected readonly staticClass = MESH_100GP;

  private pin_ = -1;
  private state_ = -1;
  private pwm_ = -1;

  public async getDataWait() {
    this.checkConnected();
    return {
      name: this.peripheral.localName!,
      address: this.peripheral.address,
      battery: this.meshBlock.battery,
    };
  }

  public async getDigitalInputDataWait(pin: number) {
    this.checkConnected();
    const _requestId = this.requestId.next();
    this.setDin(pin, _requestId);
    await this.getSensorDataWait(_requestId);
    return this.state_;
  }

  public async getPwmDataWait() {
    this.checkConnected();
    const _requestId = this.requestId.next();
    this.setPwm(_requestId);
    await this.getSensorDataWait(_requestId);
    return this.pwm_;
  }

  /**
   * setMode
   *
   * @param digitalIn {p1:boolean, p2:boolean, p3:boolean}
   * @param digitalInNotify {p1:boolean, p2:boolean, p3:boolean}
   * @param digitalOut {p1:boolean, p2:boolean, p3:boolean}
   * @param pwmRatio 0 ~ 255
   * @param vcc VCC.AUTO or VCC.ON or VCC.OFF
   * @param analogInRangeUpper 0.00 ~ 3.00[V]
   * @param analogInRangeBottom 0.00 ~ 3.00[V]
   * @param analogInNotify AnalogInputEventCondition.NotNotify or AnalogInputEventCondition.AboveThreshold or AnalogInputEventCondition.BelowThreshold
   */
  public setMode(
    digitalIn: MESH_100GP['DigitalPins'],
    digitalInNotify: MESH_100GP['DigitalPins'],
    digitalOut: MESH_100GP['DigitalPins'],
    pwmRatio: number,
    vcc: number,
    analogInRangeUpper: number,
    analogInRangeBottom: number,
    analogInNotify: number
  ): void {
    const gpioBlock = this.meshBlock as MeshJsGp;
    const command = gpioBlock.parseSetmodeCommand(
      digitalIn,
      digitalInNotify,
      digitalOut,
      pwmRatio,
      vcc,
      analogInRangeUpper,
      analogInRangeBottom,
      analogInNotify
    );
    this.writeWOResponse(command);
  }

  public setDin(pin: number, opt_requestId = 0): void {
    const gpioBlock = this.meshBlock as MeshJsGp;
    const command = gpioBlock.parseSetDinCommand(pin, opt_requestId);
    this.writeWOResponse(command);
  }

  public setAin(mode: number, opt_requestId = 0) {
    const gpioBlock = this.meshBlock as MeshJsGp;
    const command = gpioBlock.parseSetAinCommand(mode, opt_requestId);
    this.writeWOResponse(command);
  }

  public setVout(pin: number, opt_requestId = 0) {
    const gpioBlock = this.meshBlock as MeshJsGp;
    const command = gpioBlock.parseSetVoutCommand(pin, opt_requestId);
    this.writeWOResponse(command);
  }

  public setDout(pin: number, opt_requestId = 0) {
    const gpioBlock = this.meshBlock as MeshJsGp;
    const command = gpioBlock.parseSetDoutCommand(pin, opt_requestId);
    this.writeWOResponse(command);
  }

  public setPwm(opt_requestId = 0) {
    const gpioBlock = this.meshBlock as MeshJsGp;
    const command = gpioBlock.parseSetPWMCommand(opt_requestId);
    this.writeWOResponse(command);
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100GP.PREFIX) !== -1;
  }

  protected prepareConnect(): void {
    this.meshBlock = new MeshJsGp();
    const gpioBlock = this.meshBlock as MeshJsGp;

    gpioBlock.onDigitalInputEvent = (pin: number, state: number) => {
      if (typeof this.onDigitalInputEvent !== 'function') {
        return;
      }
      this.onDigitalInputEvent(pin, state);
    };

    gpioBlock.onAnalogInputEvent = (level: number) => {
      if (typeof this.onAnalogInputEvent !== 'function') {
        return;
      }
      this.onAnalogInputEvent(level);
    };

    gpioBlock.onDigitalInput = (
      requestId: number,
      pin: number,
      state: number
    ) => {
      if (typeof this.onDigitalInput !== 'function') {
        return;
      }
      if (this.requestId.isDefaultId(requestId)) {
        // Emit Event
        this.onDigitalInput(pin, state);
        return;
      }
      // Update Inner Values
      this.requestId.received(requestId);
      this.pin_ = pin;
      this.state_ = state;
    };

    gpioBlock.onAnalogInput = (
      requestId: number,
      state: number,
      mode: number
    ) => {
      if (typeof this.onAnalogInput !== 'function') {
        return;
      }
      this.onAnalogInput(requestId, state, mode);
    };

    gpioBlock.onVOutput = (requestId: number, state: number) => {
      if (typeof this.onVOutput !== 'function') {
        return;
      }
      this.onVOutput(requestId, state);
    };

    gpioBlock.onDigitalOutput = (
      requestId: number,
      pin: number,
      state: number
    ) => {
      if (typeof this.onDigitalOutput !== 'function') {
        return;
      }
      this.onDigitalOutput(requestId, pin, state);
    };

    gpioBlock.onPwm = (requestId: number, level: number) => {
      if (typeof this.onPwm !== 'function') {
        return;
      }
      if (this.requestId.isDefaultId(requestId)) {
        // Emit Event
        this.onPwm(level);
        return;
      }
      // Update Inner Values
      this.requestId.received(requestId);
      this.pwm_ = level;
    };

    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }

  protected async getSensorDataWait(requestId: number) {
    const _TIMEOUT_MSEC = 2500 as const;
    let _isTimeout = false;

    const start = Date.now();

    const _timeoutId = setTimeout(() => {
      _isTimeout = true;
    }, _TIMEOUT_MSEC);

    const INTERVAL_TIME = 50 as const;
    const _result = await new Promise((resolve) => {
      const _intervalId = setInterval(() => {
        if (!this.requestId.isReceived(requestId)) {
          if (_isTimeout) {
            clearInterval(_intervalId);
            resolve(null);
          }
          return;
        }
        clearTimeout(_timeoutId);
        clearInterval(_intervalId);
        console.log(Date.now() - start + ' [ms]');
        resolve(true);
      }, INTERVAL_TIME);
    });
    // if (this.notifyMode_ !== MESH_100MD.NotifyMode.ONCE) {
    //   // Continus previous mode
    //   this.setMode(this.notifyMode_, this.detectionTime_, this.responseTime_);
    // }
    if (_result == null) {
      throw new MeshJsTimeOutError(MESH_100GP.PartsName);
    }
    return _result;
  }
}
