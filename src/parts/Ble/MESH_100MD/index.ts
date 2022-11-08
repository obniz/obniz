/**
 * @packageDocumentation
 * @module Parts.MESH_100MD
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { Motion } from '../utils/abstracts/MESHjs/block/Motion';
import { MESHJsTimeOutError } from '../utils/abstracts/MESHjs/util/Error';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';

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
  public static readonly LocalName = /^MESH-100MD/;

  public static readonly NotifyMode = Motion.NotifyMode;
  public static readonly MotionState = Motion.MotionState;

  // Event Handler
  public onSensorEvent:
    | ((motionState: number, nofifyMode: number) => void)
    | null = null;

  protected readonly staticClass = MESH_100MD;

  private retMotionState_ = -1;
  private notifyMode_ = -1;
  private holdingTime_ = 500; // [ms]
  private detectionTime_ = 500; // [ms]

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
    return Motion.isMESHblock(peripheral.localName, opt_serialnumber);
  }

  /**
   * getDataWait
   *
   * @returns
   */
  public async getDataWait() {
    this.checkConnected();
    return {
      name: this.peripheral!.localName!,
      address: this.peripheral.address,
      motionState: await this.getSensorDataWait(),
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
    this.setMode_(
      MESH_100MD.NotifyMode.ONCE,
      this.holdingTime_,
      this.detectionTime_,
      _requestId
    );

    let _isTimeout = false;
    const _timeoutId = setTimeout(() => {
      _isTimeout = true;
    }, opt_timeoutMsec);

    const INTERVAL_TIME = 50 as const;
    const _result = await new Promise<number | null>((resolve) => {
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
      this.setMode(this.notifyMode_, this.holdingTime_, this.detectionTime_);
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
   * @param opt_holdingTime
   * @param opt_detectionTime
   */
  public setMode(
    notifyMode: number,
    opt_holdingTime = 500,
    opt_detectionTime = 500
  ): void {
    this.setMode_(
      notifyMode,
      opt_holdingTime,
      opt_detectionTime,
      this.requestId.defaultId()
    );
    this.notifyMode_ = notifyMode;
    this.holdingTime_ = opt_holdingTime;
    this.detectionTime_ = opt_detectionTime;
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
    holdingTime: number,
    detectionTime: number,
    requestId: number
  ): void {
    const motionBlock = this.meshBlock as Motion;
    const command = motionBlock.createSetmodeCommand(
      notifyMode,
      holdingTime,
      detectionTime,
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
