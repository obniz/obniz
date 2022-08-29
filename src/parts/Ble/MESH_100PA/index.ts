/**
 * @packageDocumentation
 * @module Parts.MESH_100PA
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { Brightness } from '../utils/abstracts/MESHjs/block/Brightness';
import { MESHJsTimeOutError } from '../utils/abstracts/MESHjs/util/Error';

export interface MESH_100PAOptions {}

/**
 * advertisement data from MESH_100PA
 */
export interface MESH_100PA_Data {
  name: string;
  address: string;
}

/** MESH_100PA management class */
export default class MESH_100PA extends MESH<MESH_100PA_Data> {
  public static readonly PartsName = 'MESH_100PA';
  public static readonly PREFIX = 'MESH-100PA';

  public static readonly NotifyMode = Brightness.NotifyMode;

  // Event Handler
  public onSensorEvent:
    | ((proximity: number, brightness: number) => void)
    | null = null;

  protected readonly staticClass = MESH_100PA;

  private proximity_ = -1;
  private brightness_ = -1;

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
   * getSensorDataWait
   *
   * @returns
   */
  public async getSensorDataWait() {
    this.checkConnected();
    const _requestId = this.requestId.next();
    this.setMode_(MESH_100PA.NotifyMode.ONCE, _requestId);

    const _TIMEOUT_MSEC = 2000 as const;
    let _isTimeout = false;
    const _timeoutId = setTimeout(() => {
      _isTimeout = true;
    }, _TIMEOUT_MSEC);

    const INTERVAL_TIME = 50 as const;
    const _result = await new Promise<{
      proximity: number;
      brightness: number;
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
        resolve({ proximity: this.proximity_, brightness: this.brightness_ });
      }, INTERVAL_TIME);
    });
    if (_result == null) {
      throw new MESHJsTimeOutError(this.peripheral.localName!);
    }
    return _result;
  }

  /**
   * setMode
   *
   * @param notifyMode
   */
  public setMode(notifyMode: number): void {
    this.setMode_(notifyMode, this.requestId.defaultId());
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100PA.PREFIX) !== -1;
  }

  protected prepareConnect(): void {
    this.meshBlock = new Brightness();

    // set Event Handler
    const brightnessBlock = this.meshBlock as Brightness;
    brightnessBlock.onSensorEvent = (
      proximity: number,
      brightness: number,
      requestId: number
    ) => this.setHandler_(proximity, brightness, requestId);

    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }

  private setMode_(notifyMode: number, requestId: number): void {
    const brightnessBlock = this.meshBlock as Brightness;
    const command = brightnessBlock.parseSetmodeCommand(notifyMode, requestId);
    this.writeWOResponse(command);
  }

  private setHandler_(
    proximity: number,
    brightness: number,
    requestId: number
  ) {
    // Update Inner Values
    this.requestId.received(requestId);
    this.proximity_ = proximity;
    this.brightness_ = brightness;

    // Emit Event
    if (typeof this.onSensorEvent !== 'function') {
      return;
    }
    if (!this.requestId.isDefaultId(requestId)) {
      return;
    }
    this.onSensorEvent(proximity, brightness);
  }
}
