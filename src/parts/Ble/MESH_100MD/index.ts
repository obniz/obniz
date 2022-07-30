/**
 * @packageDocumentation
 * @module Parts.MESH_100MD
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { MeshJsMd } from '../MESH_js/MeshJsMd';

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

  // Event Handler
  public onSensorEvent:
    | ((motionState: number, detectionMode: number) => void)
    | null = null;

  protected readonly staticClass = MESH_100MD;

  public async getDataWait() {
    this.checkConnected();
    const motionBlock = this.meshBlock as MeshJsMd;
    return {
      name: this.peripheral!.localName!,
      address: this.peripheral.address,
    };
  }

  public setMode(
    detectionMode: number,
    opt_detectionTime = 500,
    opt_responseTime = 500,
    opt_requestId = 0
  ): void {
    const motionBlock = this.meshBlock as MeshJsMd;
    const command = motionBlock.parseSetmodeCommand(
      detectionMode,
      opt_detectionTime,
      opt_responseTime,
      opt_requestId
    );
    this.writeWOResponse(command);
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100MD.PREFIX) !== -1;
  }

  protected prepareConnect(): void {
    this.meshBlock = new MeshJsMd();

    // set Event handler
    const motionBlock = this.meshBlock as MeshJsMd;
    motionBlock.onSensorEvent = (
      motionState: number,
      detectionMode: number,
      requestId: number
    ) => {
      if (typeof this.onSensorEvent !== 'function') {
        return;
      }
      this.onSensorEvent(motionState, detectionMode);
    };

    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }
}
