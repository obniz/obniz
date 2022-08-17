/**
 * @packageDocumentation
 * @module Parts.MESH_100MD
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { Motion } from '../utils/abstracts/MESHjs/block/Motion';
import { MESHJsTimeOutError } from '../utils/abstracts/MESHjs/util/Error';

export interface MESH_100MDOptions {}

/**
 * advertisement data from MESH_100MD
 */
export interface MESH_100MD_Data {
  name: string;
  address: string;
}

/** MESH_100MD management class */
export default class MESH_100MD extends MESH<MESH_100MD_Data> {
  public static readonly PartsName = 'MESH_100MD';
  public static readonly PREFIX = 'MESH-100MD';
  public static readonly NotifyMode = Motion.NotifyMode;
  public static readonly MotionState = Motion.MotionState;

  // Event Handler
  public onSensorEvent:
    | ((motionState: number, nofifyMode: number) => void)
    | null = null;

  protected readonly staticClass = MESH_100MD;

  private retMotionState_ = -1;
  private notifyMode_ = -1;
  private detectionTime_ = 500; // [ms]
  private holdingTime_ = 500; // [ms]

  /**
   * getDataWait
   *
   * @returns
   */
  public async getDataWait() {
    this.checkConnected();
    const motionBlock = this.meshBlock as Motion;
    return {
      name: this.peripheral!.localName!,
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
    this.setMode_(
      MESH_100MD.NotifyMode.ONCE,
      this.detectionTime_,
      this.holdingTime_,
      _requestId
    );

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
        resolve(this.retMotionState_);
      }, INTERVAL_TIME);
    });
    if (MESH_100MD.NotifyMode.ALWAYS < this.notifyMode_) {
      // Continus previous mode
      this.setMode(this.notifyMode_, this.detectionTime_, this.holdingTime_);
    }
    if (_result == null) {
      throw new MESHJsTimeOutError(this.peripheral.localName!);
    }
    return _result;
  }

  /**
   * setMode
   *
   * @param notifyMode
   * @param opt_detectionTime
   * @param opt_holdingTime
   */
  public setMode(
    notifyMode: number,
    opt_detectionTime = 500,
    opt_holdingTime = 500
  ): void {
    this.setMode_(
      notifyMode,
      opt_detectionTime,
      opt_holdingTime,
      this.requestId.defaultId()
    );
    this.notifyMode_ = notifyMode;
    this.detectionTime_ = opt_detectionTime;
    this.holdingTime_ = opt_holdingTime;
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100MD.PREFIX) !== -1;
  }

  protected prepareConnect(): void {
    this.meshBlock = new Motion();

    // set Event Handler
    const motionBlock = this.meshBlock as Motion;
    motionBlock.onSensorEvent = (
      motionState: number,
      notifyMode: number,
      requestId: number
    ) => this.setHandler_(motionState, notifyMode, requestId);

    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }

  private setMode_(
    notifyMode: number,
    detectionTime: number,
    holdingTime: number,
    requestId: number
  ): void {
    const motionBlock = this.meshBlock as Motion;
    const command = motionBlock.parseSetmodeCommand(
      notifyMode,
      detectionTime,
      holdingTime,
      requestId
    );
    this.writeWOResponse(command);
  }

  private setHandler_(
    motionState: number,
    notifyMode: number,
    requestId: number
  ) {
    // Update Inner Values
    this.requestId.received(requestId);
    this.retMotionState_ = motionState;

    // Emit Event
    if (typeof this.onSensorEvent !== 'function') {
      return;
    }
    if (!this.requestId.isDefaultId(requestId)) {
      return;
    }
    this.onSensorEvent(motionState, notifyMode);
  }
}
