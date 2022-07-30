/**
 * @packageDocumentation
 * @module Parts.MESH_100TH
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { MeshJsTh } from '../MESH_js/MeshJsTh';

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

  public static readonly NotifyType = MeshJsTh.NOTIFY_TYPE;

  // Event Handler
  public onSensorEvent:
    | ((temperature: number, humidity: number) => void)
    | null = null;

  protected readonly staticClass = MESH_100TH;

  public async getDataWait() {
    this.checkConnected();
    const _th = this.meshBlock as MeshJsTh;
    return {
      name: this.peripheral.localName!,
      address: this.peripheral.address,
    };
  }

  public setMode(
    temperatureUpper: number,
    temperatureBottom: number,
    temperatureCondition: number,
    humidityUpper: number,
    humidityBottom: number,
    humidityCondision: number,
    type: number,
    opt_requestId = 0
  ): void {
    const temperatureAndHumidityBlock = this.meshBlock as MeshJsTh;
    const command = temperatureAndHumidityBlock.parseSetmodeCommand(
      temperatureUpper,
      temperatureBottom,
      humidityUpper,
      humidityBottom,
      temperatureCondition,
      humidityCondision,
      type,
      opt_requestId
    );
    this.writeWOResponse(command);
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100TH.PREFIX) !== -1;
  }

  protected prepareConnect(): void {
    this.meshBlock = new MeshJsTh();
    const temperatureAndHumidityBlock = this.meshBlock as MeshJsTh;
    temperatureAndHumidityBlock.onSensorEvent = (
      temperature: number,
      humidity: number,
      requestId: number
    ) => {
      if (typeof this.onSensorEvent !== 'function') {
        return;
      }
      this.onSensorEvent(temperature, humidity);
    };
    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }
}
