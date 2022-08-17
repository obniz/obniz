/**
 * @packageDocumentation
 * @module Parts.MESH_100TH
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { TempHumid } from '../utils/abstracts/MESHjs/block/TempHumid';
import { MESHJsTimeOutError } from '../utils/abstracts/MESHjs/util/Error';

export interface MESH_100THOptions {}

/**
 * advertisement data from MESH_100TH
 */
export interface MESH_100TH_Data {
  name: string;
  address: string;
}

/** MESH_100TH management class */
export default class MESH_100TH extends MESH<MESH_100TH_Data> {
  public static readonly PartsName = 'MESH_100TH';
  public static readonly PREFIX = 'MESH-100TH';

  public static readonly NotifyMode = TempHumid.NotifyMode;
  public static readonly EmitCondition = TempHumid.EmitCondition;

  // Event Handler
  public onSensorEvent:
    | ((temperature: number, humidity: number) => void)
    | null = null;

  protected readonly staticClass = MESH_100TH;

  private retTemperature_ = -1;
  private retHumidity_ = -1;
  private temperatureUpper_ = 50;
  private temperatureBottom_ = -10;
  private humidityUpper_ = 100;
  private humidityBottom_ = 0;
  private temperatureCondition_: number =
    MESH_100TH.EmitCondition.ABOVE_UPPER_AND_BELOW_BOTTOM;
  private humidityCondision_: number =
    MESH_100TH.EmitCondition.ABOVE_UPPER_AND_BELOW_BOTTOM;
  private notifyMode_ = -1;

  public async getDataWait() {
    this.checkConnected();
    const _th = this.meshBlock as TempHumid;
    return {
      name: this.peripheral.localName!,
      address: this.peripheral.address,
    };
  }

  /**
   * getSensorDataWait
   *
   * @returns
   */
  public async getSensorDataWait() {
    this.checkConnected();
    const _requestId = this.requestId.next();
    this.setMode_(0, 0, 0, 0, 0, 0, MESH_100TH.NotifyMode.ONCE, _requestId);

    const _TIMEOUT_MSEC = 2000 as const;
    let _isTimeout = false;
    const _timeoutId = setTimeout(() => {
      _isTimeout = true;
    }, _TIMEOUT_MSEC);

    const INTERVAL_TIME = 50 as const;
    const _result = await new Promise((resolve) => {
      const _intervalId = setInterval(() => {
        if (!this.requestId.isReceived(_requestId)) {
          if (_isTimeout) {
            clearInterval(_intervalId);
            resolve(null);
          }
          return;
        }
        clearTimeout(_timeoutId);
        clearInterval(_intervalId);
        resolve({
          temperature: this.retTemperature_,
          humidity: this.retHumidity_,
        });
      }, INTERVAL_TIME);
    });
    if (MESH_100TH.NotifyMode.ALWAYS < this.notifyMode_) {
      // Continus previous mode
      this.setMode(
        this.temperatureUpper_,
        this.temperatureBottom_,
        this.humidityUpper_,
        this.humidityBottom_,
        this.temperatureCondition_,
        this.humidityCondision_,
        this.notifyMode_
      );
    }
    if (_result == null) {
      throw new MESHJsTimeOutError(this.peripheral.localName!);
    }
    return _result;
  }

  /**
   * setMode
   *
   * @param temperatureUpper
   * @param temperatureBottom
   * @param humidityUpper
   * @param humidityBottom
   * @param temperatureCondition
   * @param humidityCondision
   * @param notifyMode
   */
  public setMode(
    temperatureUpper: number,
    temperatureBottom: number,
    humidityUpper: number,
    humidityBottom: number,
    temperatureCondition: number,
    humidityCondision: number,
    notifyMode: number
  ): void {
    this.setMode_(
      temperatureUpper,
      temperatureBottom,
      humidityUpper,
      humidityBottom,
      temperatureCondition,
      humidityCondision,
      notifyMode,
      this.requestId.defaultId()
    );
    this.temperatureUpper_ = temperatureUpper;
    this.temperatureBottom_ = temperatureBottom;
    this.humidityUpper_ = humidityUpper;
    this.humidityBottom_ = humidityBottom;
    this.temperatureCondition_ = temperatureCondition;
    this.humidityCondision_ = humidityCondision;
    this.notifyMode_ = notifyMode;
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100TH.PREFIX) !== -1;
  }

  protected prepareConnect(): void {
    this.meshBlock = new TempHumid();
    const temperatureAndHumidityBlock = this.meshBlock as TempHumid;

    // set Event Handler
    temperatureAndHumidityBlock.onSensorEvent = (
      temperature: number,
      humidity: number,
      requestId: number
    ) => this.setHandler_(temperature, humidity, requestId);

    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }

  private setMode_(
    temperatureUpper: number,
    temperatureBottom: number,
    humidityUpper: number,
    humidityBottom: number,
    temperatureCondition: number,
    humidityCondision: number,
    notifyMode: number,
    requestId: number
  ): void {
    const temperatureAndHumidityBlock = this.meshBlock as TempHumid;
    const command = temperatureAndHumidityBlock.parseSetmodeCommand(
      temperatureUpper,
      temperatureBottom,
      humidityUpper,
      humidityBottom,
      temperatureCondition,
      humidityCondision,
      notifyMode,
      requestId
    );
    this.writeWOResponse(command);
  }

  private setHandler_(
    temperature: number,
    humidity: number,
    requestId: number
  ) {
    // Update Inner Values
    this.requestId.received(requestId);
    this.retTemperature_ = temperature;
    this.retHumidity_ = humidity;

    // Emit Event
    if (typeof this.onSensorEvent !== 'function') {
      return;
    }
    if (!this.requestId.isDefaultId(requestId)) {
      return;
    }
    this.onSensorEvent(temperature, humidity);
  }
}
