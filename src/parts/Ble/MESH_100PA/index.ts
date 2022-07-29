/**
 * @packageDocumentation
 * @module Parts.MESH_100PA
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { MeshJsPa } from '../MESH_js/MeshJsPa';

export interface MESH_100PAOptions {}

/**
 * advertisement data from MESH_100PA
 */
export interface MESH_100PA_Data {
  name: string;
  address: string;
  battery: number; // 0 ~ 10
  proximity: number;
  brightness: number;
}

/** MESH_100PA management class */
export default class MESH_100PA extends MESH<MESH_100PA_Data> {
  public static readonly PartsName = 'MESH_100PA';
  public static readonly PREFIX = 'MESH-100PA';

  public static readonly NotifyType = MeshJsPa.NOTIFY_TYPE;

  // Event Handler
  public onNotify: ((resp: MeshJsPa['response_']) => void) | null = null;

  protected readonly staticClass = MESH_100PA;

  public async getDataWait() {
    this.checkConnected();
    const brightnessBlock = this.meshBlock as MeshJsPa;
    return {
      name: this.peripheral.localName!,
      address: this.peripheral.address,
      battery: this.meshBlock.battery,
      proximity: brightnessBlock.getResponse.proximity,
      brightness: brightnessBlock.getResponse.brightness,
    };
  }

  public setMode(type: number, opt_requestId = 0): void {
    const brightnessBlock = this.meshBlock as MeshJsPa;
    const command = brightnessBlock.parseSetmodeCommand(type, opt_requestId);
    this.writeWOResponse(command);
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100PA.PREFIX) !== -1;
  }

  protected prepareConnect(): void {
    this.meshBlock = new MeshJsPa();
    const brightnessBlock = this.meshBlock as MeshJsPa;
    brightnessBlock.onNotify = (response: MeshJsPa['response_']) => {
      if (typeof this.onNotify !== 'function') {
        return;
      }
      this.onNotify(response);
    };
    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }
}
