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
    const brightnessBlock = this.meshBlock as MeshJsPa;
    return {
      name: this.peripheral.localName!,
      address: this.peripheral.address,
    };
  }

  public async getSensorDataWait() {
    this.checkConnected();

    const _requestId = this.requestId.next();
    this.setMode_(MESH_100PA.NotifyMode.ONCE, _requestId);

    const _TIMEOUT_MSEC = 1500 as const;
    const _timeoutId = setTimeout(() => {
      throw new MeshJsTimeOutError(MESH_100PA.PartsName);
    }, _TIMEOUT_MSEC);

    const INTERVAL_TIME = 50 as const;
    const _result = await new Promise((resolve) => {
      const _intervalId = setInterval(() => {
        if (!this.requestId.isReceived(_requestId)) {
          return;
        }
        clearTimeout(_timeoutId);
        clearInterval(_intervalId);
        resolve({ proximity: this.proximity_, brightness: this.brightness_ });
      }, INTERVAL_TIME);
    });

    return _result;
  }

  public setMode(type: number): void {
    this.setMode_(type, this.requestId.defaultId());
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100PA.PREFIX) !== -1;
  }

  protected prepareConnect(): void {
    this.meshBlock = new MeshJsPa();
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

  private setMode_(notifyMode: number, requestId: number): void {
    const brightnessBlock = this.meshBlock as MeshJsPa;
    const command = brightnessBlock.parseSetmodeCommand(notifyMode, requestId);
    this.writeWOResponse(command);
  }
}
