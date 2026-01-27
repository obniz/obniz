/**
 * @packageDocumentation
 * @module Parts.utils.services
 */

import { BleRemoteService } from '../../../../obniz/libs/embeds/bleHci/bleRemoteService';
import { UUID16 } from '../../../../obniz/libs/embeds/bleHci/bleTypes';

export class BleGenericAccess {
  private _service: BleRemoteService;

  constructor(service: BleRemoteService) {
    this._service = service;
  }

  public async getDeviceNameWait(): Promise<string | null> {
    const char = this._service.getCharacteristic('2A00' as UUID16);
    if (!char) {
      return null;
    }
    return await char.readTextWait();
  }
}
