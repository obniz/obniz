/**
 * @packageDocumentation
 * @module Parts.MESH_100TH
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { TempHumid } from '../utils/abstracts/MESHjs/block/TempHumid';
import { MESHJsTimeOutError } from '../utils/abstracts/MESHjs/util/Error';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';

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
  public static readonly LocalName = /^MESH-100TH/;

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
  private temperatureLower_ = -10;
  private humidityUpper_ = 100;
  private humidityLower_ = 0;
  private temperatureCondition_: number =
    MESH_100TH.EmitCondition.ABOVE_UPPER_OR_BELOW_LOWER;
  private humidityCondition_: number =
    MESH_100TH.EmitCondition.ABOVE_UPPER_OR_BELOW_LOWER;
  private notifyMode_ = -1;

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
    return TempHumid.isMESHblock(peripheral.localName, opt_serialnumber);
  }

  public async getDataWait() {
    this.checkConnected();
    const _th = this.meshBlock as TempHumid;
    return {
      name: this.peripheral.localName!,
      address: this.peripheral.address,
      ...(await this.getSensorDataWait()),
    };
  }

  /**
   * getSensorDataWait
   *
   * @returns
   */
  public async getSensorDataWait(opt_timeoutMsec = this.TIMEOUT_MSEC) {
    this.checkConnected();
    const _requestId = this.requestId.next();
    this.setMode_(0, 0, 0, 0, 0, 0, MESH_100TH.NotifyMode.ONCE, _requestId);

    let _isTimeout = false;
    const _timeoutId = setTimeout(() => {
      _isTimeout = true;
    }, opt_timeoutMsec);

    const INTERVAL_TIME = 50 as const;
    const _result = await new Promise<{
      temperature: number;
      humidity: number;
    } | null>((resolve) => {
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
        this.temperatureLower_,
        this.humidityUpper_,
        this.humidityLower_,
        this.temperatureCondition_,
        this.humidityCondition_,
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
   * @param temperatureLower
   * @param humidityUpper
   * @param humidityLower
   * @param temperatureCondition
   * @param humidityCondition
   * @param notifyMode
   */
  public setMode(
    temperatureUpper: number,
    temperatureLower: number,
    humidityUpper: number,
    humidityLower: number,
    temperatureCondition: number,
    humidityCondition: number,
    notifyMode: number
  ): void {
    this.setMode_(
      temperatureUpper,
      temperatureLower,
      humidityUpper,
      humidityLower,
      temperatureCondition,
      humidityCondition,
      notifyMode,
      this.requestId.defaultId()
    );
    this.temperatureUpper_ = temperatureUpper;
    this.temperatureLower_ = temperatureLower;
    this.humidityUpper_ = humidityUpper;
    this.humidityLower_ = humidityLower;
    this.temperatureCondition_ = temperatureCondition;
    this.humidityCondition_ = humidityCondition;
    this.notifyMode_ = notifyMode;
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
    temperatureLower: number,
    humidityUpper: number,
    humidityLower: number,
    temperatureCondition: number,
    humidityCondition: number,
    notifyMode: number,
    requestId: number
  ): void {
    const temperatureAndHumidityBlock = this.meshBlock as TempHumid;
    const command = temperatureAndHumidityBlock.createSetmodeCommand(
      temperatureUpper,
      temperatureLower,
      humidityUpper,
      humidityLower,
      temperatureCondition,
      humidityCondition,
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
