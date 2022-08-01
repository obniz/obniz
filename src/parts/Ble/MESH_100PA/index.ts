/**
 * @packageDocumentation
 * @module Parts.MESH_100PA
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { MeshJsPa } from '../MESH_js/MeshJsPa';
import {
  MeshJsInvalidValueError,
  MeshJsTimeOutError,
} from '../MESH_js/MeshJsError';
import { rejects } from 'assert';

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

  public static readonly EmitCondition = MeshJsPa.EmitCondition;
  public static readonly NotifyMode = MeshJsPa.NotifyMode;

  // Event Handler
  public onSensorEvent:
    | ((proximity: number, brightness: number) => void)
    | null = null;

  protected readonly staticClass = MESH_100PA;

  private proximity_ = -1;
  private brightness_ = -1;

  public async getDataWait() {
    this.checkConnected();
    return {
      name: this.peripheral.localName!,
      address: this.peripheral.address,
    };
  }

  public async getSensorDataWait() {
    this.checkConnected();
    // const _start = Date.now();
    const _requestId = this.requestId.next();
    const _proximityRangeUpper: number = 0 as const;
    const _proximityRangeBottom: number = 0 as const;
    const _brightnessRangeUpper: number = 0 as const;
    const _brightnessRangeBottom: number = 0 as const;
    this.setMode_(
      _proximityRangeUpper,
      _proximityRangeBottom,
      _brightnessRangeUpper,
      _brightnessRangeBottom,
      MESH_100PA.EmitCondition.ABOVE_UPPER_AND_BELOW_BOTTOM,
      MESH_100PA.EmitCondition.ABOVE_UPPER_AND_BELOW_BOTTOM,
      MESH_100PA.NotifyMode.ONCE,
      _requestId
    );

    const _TIMEOUT_MSEC = 2000 as const;
    let _isTimeout = false;
    const _timeoutId = setTimeout(() => {
      _isTimeout = true;
    }, _TIMEOUT_MSEC);

    // let _count = 0;
    const INTERVAL_TIME = 50 as const;
    const _result = await new Promise((resolve) => {
      const _intervalId = setInterval(() => {
        // _count ++;
        if (!this.requestId.isReceived(_requestId)) {
          if (_isTimeout) {
            clearInterval(_intervalId);
            resolve(null);
          }
          return;
        }
        clearTimeout(_timeoutId);
        clearInterval(_intervalId);
        // const end = Date.now();
        // console.log(end - _start + ' [ms] ' + _count);
        resolve({ proximity: this.proximity_, brightness: this.brightness_ });
      }, INTERVAL_TIME);
    });
    if (_result == null) {
      throw new MeshJsTimeOutError(MESH_100PA.PartsName);
    }
    return _result;
  }

  public setMode(
    proximityRangeUpper: number,
    proximityRangeBottom: number,
    brightnessRangeUpper: number,
    brightnessRangeBottom: number,
    proximityCondition: number,
    brightnessCondition: number,
    notifyMode: number
  ): void {
    this.setMode_(
      proximityRangeUpper,
      proximityRangeBottom,
      brightnessRangeUpper,
      brightnessRangeBottom,
      proximityCondition,
      brightnessCondition,
      notifyMode,
      this.requestId.defaultId()
    );
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100PA.PREFIX) !== -1;
  }

  protected prepareConnect(): void {
    this.meshBlock = new MeshJsPa();

    // set Event Handler
    const brightnessBlock = this.meshBlock as MeshJsPa;
    brightnessBlock.onSensorEvent = (
      proximity: number,
      brightness: number,
      requestId: number
    ) => {
      if (typeof this.onSensorEvent !== 'function') {
        return;
      }
      if (this.requestId.isDefaultId(requestId)) {
        // Emit Event
        this.onSensorEvent(proximity, brightness);
        return;
      }
      // Update Inner Values
      this.requestId.received(requestId);
      this.proximity_ = proximity;
      this.brightness_ = brightness;
    };
    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }

  private setMode_(
    proximityRangeUpper: number,
    proximityRangeBottom: number,
    brightnessRangeUpper: number,
    brightnessRangeBottom: number,
    proximityCondition: number,
    brightnessCondition: number,
    notifyMode: number,
    requestId: number
  ): void {
    const brightnessBlock = this.meshBlock as MeshJsPa;
    const command = brightnessBlock.parseSetmodeCommand(
      proximityRangeUpper,
      proximityRangeBottom,
      brightnessRangeUpper,
      brightnessRangeBottom,
      proximityCondition,
      brightnessCondition,
      notifyMode,
      requestId
    );
    this.writeWOResponse(command);
  }
}
