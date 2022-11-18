/**
 * @packageDocumentation
 * @module Parts.utils.services
 */

import { BleRemoteService } from '../../../../obniz/libs/embeds/bleHci/bleRemoteService';
import { UUID16 } from '../../../../obniz/libs/embeds/bleHci/bleTypes';

export class BleBatteryService {
  private _service: BleRemoteService;

  constructor(service: BleRemoteService) {
    this._service = service;
  }

  public async getBatteryLevelWait(): Promise<number | null> {
    const char = this._service.getCharacteristic('2A19' as UUID16);
    if (!char) {
      return null;
    }
    return await char.readNumberWait();
  }

  public getBatteryLevel(): Promise<number | null> {
    return this.getBatteryLevelWait();
  }
}
