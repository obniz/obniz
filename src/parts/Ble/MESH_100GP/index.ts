/**
 * @packageDocumentation
 * @module Parts.MESH_100GP
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { GPIO } from '../utils/abstracts/MESHjs/block/GPIO';
import { MESHJsTimeOutError } from '../utils/abstracts/MESHjs/util/Error';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';

export interface MESH_100GPOptions {}

/**
 * data from MESH_100GP
 */
export interface MESH_100GP_Data {
  name: string; // device name
  address: string; // bluetooth address
}

/** MESH_100GP management class */
export default class MESH_100GP extends MESH<MESH_100GP_Data> {
  public static readonly PartsName = 'MESH_100GP';
  public static readonly LocalName = /^MESH-100GP/;

  public static readonly AnalogInputEventCondition =
    GPIO.AnalogInputEventCondition;
  public static readonly AnalogInputNotifyMode = GPIO.AnalogInputNotifyMode;
  public static readonly Pin = GPIO.Pin;
  public static readonly State = GPIO.State;
  public static readonly DigitalInputState = GPIO.DigitalInputState;
  public static readonly Vcc = GPIO.Vcc;
  public static readonly VccState = GPIO.VccState;

  public readonly DigitalPins: GPIO['DigitalPins'] = (this.meshBlock as GPIO)
    .DigitalPins;

  // Event Handler
  public onDigitalInputEvent:
    | ((pin: number, state: number) => void)
    | null = null;
  public onAnalogInputEvent: ((level: number) => void) | null = null;

  protected readonly staticClass = MESH_100GP;

  private digitalInputLow2High_ = { p1: false, p2: false, p3: false };
  private digitalInputHigh2Low_ = { p1: false, p2: false, p3: false };
  private digitalOutput_ = { p1: false, p2: false, p3: false };
  private pwmRatio_ = 0;
  private vcc_: number = MESH_100GP.Vcc.OFF;
  private analogInputRangeUpper_ = 0;
  private analogInputRangeLower_ = 0;
  private analogInputCondition_: number =
    MESH_100GP.AnalogInputEventCondition.NOT_NOTIFY;

  private retDigitalInState_ = -1;
  private retPwm_ = -1;
  private retVccState_ = -1;
  private retLevel_ = -1;
  private retDigitalOutState_ = -1;

  /**
   * Check MESH block
   *
   * @param peripheral
   * @param opt_serialnumber
   * @returns
   */
  public static isMESHblock(
    peripheral: BleRemotePeripheral,
    opt_serialnumber = ''
  ): boolean {
    return GPIO.isMESHblock(peripheral.localName, opt_serialnumber);
  }

  /**
   * getDataWait
   *
   * @returns
   */
  public async getDataWait() {
    this.checkConnected();
    return {
      name: this.peripheral.localName!,
      address: this.peripheral.address,
    };
  }

  /**
   * getDigitalInputDataWait
   *
   * @param pin
   * @returns
   */
  public async getDigitalInputDataWait(
    pin: number,
    opt_timeoutMsec = this.TIMEOUT_MSEC
  ) {
    const _requestId = this.requestId.next();
    const _gpioBlock = this.meshBlock as GPIO;
    const _command = _gpioBlock.createDigitalInputCommand(pin, _requestId);
    await this.getSensorDataWait(_requestId, _command, opt_timeoutMsec);
    return this.retDigitalInState_;
  }

  /**
   * getAnalogInputDataWait
   *
   * @returns
   */
  public async getAnalogInputDataWait(opt_timeoutMsec = this.TIMEOUT_MSEC) {
    const _requestId = this.requestId.next();
    const _gpioBlock = this.meshBlock as GPIO;
    const _command = _gpioBlock.createAnalogInputCommand(
      MESH_100GP.AnalogInputNotifyMode.ONCE,
      _requestId
    );
    await this.getSensorDataWait(_requestId, _command, opt_timeoutMsec);
    return this.retLevel_;
  }

  /**
   * getVOutputDataWait
   *
   * @returns
   */
  public async getVOutputDataWait(opt_timeoutMsec = this.TIMEOUT_MSEC) {
    const _requestId = this.requestId.next();
    const _gpioBlock = this.meshBlock as GPIO;
    const _command = _gpioBlock.createVOutputCommand(_requestId);
    await this.getSensorDataWait(_requestId, _command, opt_timeoutMsec);
    return this.retVccState_;
  }

  /**
   * getDigitalOutputDataWait
   *
   * @param pin
   * @returns
   */
  public async getDigitalOutputDataWait(
    pin: number,
    opt_timeoutMsec = this.TIMEOUT_MSEC
  ) {
    const _requestId = this.requestId.next();
    const _gpioBlock = this.meshBlock as GPIO;
    const _command = _gpioBlock.createDigitalOutputCommand(pin, _requestId);
    await this.getSensorDataWait(_requestId, _command, opt_timeoutMsec);
    return this.retDigitalOutState_;
  }

  /**
   * getPwmDataWait
   *
   * @returns
   */
  public async getPwmDataWait(opt_timeoutMsec = this.TIMEOUT_MSEC) {
    const _requestId = this.requestId.next();
    const _gpioBlock = this.meshBlock as GPIO;
    const _command = _gpioBlock.createPwmCommand(_requestId);
    await this.getSensorDataWait(_requestId, _command, opt_timeoutMsec);
    return this.retPwm_;
  }

  /**
   * setMode
   *
   * @param digitalInputLow2High {p1:boolean, p2:boolean, p3:boolean}
   * @param digitalInputHigh2Low {p1:boolean, p2:boolean, p3:boolean}
   * @param digitalOutput {p1:boolean, p2:boolean, p3:boolean}
   * @param pwmRatio 0-255
   * @param vcc Vcc.ON or Vcc.OFF
   * @param analogInputRangeUpper 0-255(0.00-3.00[V])
   * @param analogInputRangeLower 0-255(0.00-3.00[V])
   * @param analogInputCondition AnalogInputEventCondition.NOT_NOTIFY or AnalogInputEventCondition.ABOVE_THRESHOLD or AnalogInputEventCondition.BELOW_THRESHOLD
   */
  public setMode(
    digitalInputLow2High: MESH_100GP['DigitalPins'],
    digitalInputHigh2Low: MESH_100GP['DigitalPins'],
    digitalOutput: MESH_100GP['DigitalPins'],
    pwmRatio: number,
    vcc: number,
    analogInputRangeUpper: number,
    analogInputRangeLower: number,
    analogInputCondition: number
  ): void {
    const gpioBlock = this.meshBlock as GPIO;
    const command = gpioBlock.createSetmodeCommand(
      digitalInputLow2High,
      digitalInputHigh2Low,
      digitalOutput,
      pwmRatio,
      vcc,
      analogInputRangeUpper,
      analogInputRangeLower,
      analogInputCondition
    );
    this.writeWOResponse(command);
    this.digitalInputLow2High_ = digitalInputLow2High;
    this.digitalInputHigh2Low_ = digitalInputHigh2Low;
    this.digitalOutput_ = digitalOutput;
    this.pwmRatio_ = pwmRatio;
    this.vcc_ = vcc;
    this.analogInputRangeUpper_ = analogInputRangeUpper;
    this.analogInputRangeLower_ = analogInputRangeLower;
    this.analogInputCondition_ = analogInputCondition;
  }

  /**
   * setModeDigitalInput
   *
   * @param digitalInputLow2High { p1:boolean, p2:boolean, p3:boolean }
   * @param digitalInputHigh2Low { p1:boolean, p2:boolean, p3:boolean }
   */
  public setModeDigitalInput(
    digitalInputLow2High: MESH_100GP['DigitalPins'],
    digitalInputHigh2Low: MESH_100GP['DigitalPins']
  ): void {
    const gpioBlock = this.meshBlock as GPIO;
    const command = gpioBlock.createSetmodeCommand(
      digitalInputLow2High,
      digitalInputHigh2Low,
      this.digitalOutput_,
      this.pwmRatio_,
      this.vcc_,
      this.analogInputRangeUpper_,
      this.analogInputRangeLower_,
      this.analogInputCondition_
    );
    this.writeWOResponse(command);
    this.digitalInputLow2High_ = digitalInputLow2High;
    this.digitalInputHigh2Low_ = digitalInputHigh2Low;
  }

  /**
   * setModeAnalogInput
   *
   * @param analogInputRangeUpper 0-255(0.00-3.00[V])
   * @param analogInputRangeLower 0-255(0.00-3.00[V])
   * @param analogInputCondition AnalogInputEventCondition.NOT_NOTIFY or AnalogInputEventCondition.ABOVE_THRESHOLD or AnalogInputEventCondition.BELOW_THRESHOLD
   */
  public setModeAnalogInput(
    analogInputRangeUpper: number,
    analogInputRangeLower: number,
    analogInputCondition: number
  ): void {
    const gpioBlock = this.meshBlock as GPIO;
    const command = gpioBlock.createSetmodeCommand(
      this.digitalInputLow2High_,
      this.digitalInputHigh2Low_,
      this.digitalOutput_,
      this.pwmRatio_,
      this.vcc_,
      analogInputRangeUpper,
      analogInputRangeLower,
      analogInputCondition
    );
    this.writeWOResponse(command);
    this.analogInputRangeUpper_ = analogInputRangeUpper;
    this.analogInputRangeLower_ = analogInputRangeLower;
    this.analogInputCondition_ = analogInputCondition;
  }

  /**
   * setDigitalOutput
   *
   * @param digitalOutput { p1:boolean, p2:boolean, p3:boolean }
   */
  public setDigitalOutput(digitalOutput: MESH_100GP['DigitalPins']): void {
    const gpioBlock = this.meshBlock as GPIO;
    const command = gpioBlock.createSetmodeCommand(
      this.digitalInputLow2High_,
      this.digitalInputHigh2Low_,
      digitalOutput,
      this.pwmRatio_,
      this.vcc_,
      this.analogInputRangeUpper_,
      this.analogInputRangeLower_,
      this.analogInputCondition_
    );
    this.writeWOResponse(command);
    this.digitalOutput_ = digitalOutput;
  }

  /**
   * setPwmOutput
   *
   * @param pwmRatio 0-255
   */
  public setPwmOutput(pwmRatio: number): void {
    const gpioBlock = this.meshBlock as GPIO;
    const command = gpioBlock.createSetmodeCommand(
      this.digitalInputLow2High_,
      this.digitalInputHigh2Low_,
      this.digitalOutput_,
      pwmRatio,
      this.vcc_,
      this.analogInputRangeUpper_,
      this.analogInputRangeLower_,
      this.analogInputCondition_
    );
    this.writeWOResponse(command);
    this.pwmRatio_ = pwmRatio;
  }

  /**
   * setVOutput
   *
   * @param vcc Vcc.ON or Vcc.OFF
   */
  public setVOutput(vcc: number): void {
    const gpioBlock = this.meshBlock as GPIO;
    const command = gpioBlock.createSetmodeCommand(
      this.digitalInputLow2High_,
      this.digitalInputHigh2Low_,
      this.digitalOutput_,
      this.pwmRatio_,
      vcc,
      this.analogInputRangeUpper_,
      this.analogInputRangeLower_,
      this.analogInputCondition_
    );
    this.writeWOResponse(command);
    this.vcc_ = vcc;
  }

  protected prepareConnect(): void {
    this.meshBlock = new GPIO();
    const gpioBlock = this.meshBlock as GPIO;

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
      if (this.requestId.isDefaultId(requestId)) {
        return;
      }
      // Update Inner Values
      this.requestId.received(requestId);
      this.retDigitalInState_ = state;
      void pin;
    };

    gpioBlock.onAnalogInput = (
      requestId: number,
      level: number,
      analogInputNotifyMode: number
    ) => {
      if (this.requestId.isDefaultId(requestId)) {
        return;
      }
      if (analogInputNotifyMode !== MESH_100GP.AnalogInputNotifyMode.ONCE) {
        return;
      }
      // Update Inner Values
      this.requestId.received(requestId);
      this.retLevel_ = level;
    };

    gpioBlock.onVOutput = (requestId: number, vccState: number) => {
      if (this.requestId.isDefaultId(requestId)) {
        return;
      }
      // Update Inner Values
      this.requestId.received(requestId);
      this.retVccState_ = vccState;
    };

    gpioBlock.onDigitalOutput = (
      requestId: number,
      pin: number,
      state: number
    ) => {
      if (this.requestId.isDefaultId(requestId)) {
        return;
      }
      // Update Inner Values
      this.requestId.received(requestId);
      this.retDigitalOutState_ = state;
      void pin;
    };

    gpioBlock.onPwm = (requestId: number, level: number) => {
      if (this.requestId.isDefaultId(requestId)) {
        return;
      }
      // Update Inner Values
      this.requestId.received(requestId);
      this.retPwm_ = level;
    };

    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }

  protected async getSensorDataWait(
    requestId: number,
    command: number[],
    timeoutMsec: number
  ) {
    this.checkConnected();
    this.writeWOResponse(command);

    let _isTimeout = false;
    const _timeoutId = setTimeout(() => {
      _isTimeout = true;
    }, timeoutMsec);

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
        resolve(true);
      }, INTERVAL_TIME);
    });
    if (_result == null) {
      throw new MESHJsTimeOutError(this.peripheral.localName!);
    }
    return _result;
  }
}
